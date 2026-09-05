"use server";

import dbConnect from "@/lib/mongodb";
import { Player, ResumeRequest, User } from "@/lib/schemas";
import { requireAuth, requireRole } from "@/lib/oauth";
import { sendEmail } from "@/lib/email";
import { generatePlayerResumePdf } from "@/lib/playerResume";
import { revalidatePath } from "next/cache";

const toPlain = (value) => JSON.parse(JSON.stringify(value));

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://footballbank.soccer";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

async function sendRequestEmail({ request, type, reason, player }) {
  const requesterName = `${request.requester.firstName} ${request.requester.lastName}`;
  const playerName = `${request.player.firstName} ${request.player.lastName}`;
  const isCvRequest = request.requestType === "CV";
  const subject = type === "submitted"
    ? `Resume request received for ${playerName}`
    : type === "approved"
      ? `${isCvRequest ? "Resume download" : "Resume request"} approved for ${playerName}`
      : `Resume request update for ${playerName}`;
  const message = type === "submitted"
    ? "We have received your request and our team will review it and respond to you."
    : type === "approved"
      ? isCvRequest
        ? "Your resume download request has been approved. The professional resume is attached to this email."
        : `Your request has been approved. You can now view ${playerName}'s protected profile information.`
      : `Your request was not approved at this time${reason ? `: ${reason}` : "."}`;
  const locale = request.locale || "en";
  const link = type === "approved"
    ? `<p><a href="${siteUrl}/${locale}/players/${request.playerId}">View the approved player profile</a></p>`
    : "";

  let attachments;
  if (type === "approved" && isCvRequest && player) {
    attachments = [{
      filename: `${playerName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-resume.pdf`,
      content: await generatePlayerResumePdf(player),
    }];
  }

  await sendEmail({
    to: request.requester.email,
    subject,
    text: `Hello ${requesterName}, ${message}${type === "approved" ? ` ${siteUrl}/${locale}/players/${request.playerId}` : ""}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0b1220;max-width:600px;margin:auto"><h2 style="color:#0b1220">FootballBank International</h2><p>Hello ${escapeHtml(requesterName)},</p><p>${escapeHtml(message)}</p><p><strong>Reason provided:</strong> ${escapeHtml(request.reason)}</p>${link}<p>Thank you,<br />FootballBank International</p></div>`,
    attachments,
  });
}

export async function createResumeRequest(playerId, locale = "en", reason, requestType = "PROFILE") {
  if (!reason?.trim()) throw new Error("Please provide a reason for this request");
  const authUser = await requireAuth();
  await dbConnect();

  const [user, player] = await Promise.all([
    User.findById(authUser.id).lean(),
    Player.findById(playerId).lean(),
  ]);
  if (!user) throw new Error("Registered user account not found");
  if (!player) throw new Error("Player not found");

  const existing = await ResumeRequest.findOne({
    requesterId: user._id,
    playerId: player._id,
    requestType,
    status: "PENDING",
  }).lean();
  if (existing) throw new Error("You already have a pending request for this player");

  const request = await ResumeRequest.create({
    requesterId: user._id,
    requester: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      address: user.address,
    },
    playerId: player._id,
    player: {
      firstName: player.firstName,
      lastName: player.lastName,
      position: player.position,
    },
    locale,
    requestType,
    reason: reason.trim(),
  });

  const plainRequest = toPlain(request);
  try {
    await sendRequestEmail({ request: plainRequest, type: "submitted" });
  } catch (error) {
    console.error("Resume request confirmation email failed:", error);
  }

  revalidatePath(`/players/${playerId}`);
  revalidatePath("/admin/resume-requests");
  return { success: true, request: plainRequest };
}

export async function getAllResumeRequests() {
  await requireRole("admin");
  await dbConnect();
  const requests = await ResumeRequest.find({}).lean().sort({ createdAt: -1 });
  return requests.map((request) => ({ ...toPlain(request), id: request._id.toString() }));
}

export async function approveResumeRequest(requestId) {
  const admin = await requireRole("admin");
  await dbConnect();
  const request = await ResumeRequest.findByIdAndUpdate(
    requestId,
    { status: "APPROVED", decidedAt: new Date(), decidedBy: admin.id, rejectionReason: undefined },
    { new: true },
  ).lean();
  if (!request) throw new Error("Resume request not found");

  const plainRequest = { ...toPlain(request), id: request._id.toString() };
  const player = await Player.findById(request.playerId).lean();
  try {
    await sendRequestEmail({ request: plainRequest, type: "approved", player });
  } catch (error) {
    console.error("Resume approval email failed:", error);
  }
  revalidatePath(`/players/${request.playerId}`);
  revalidatePath("/admin/resume-requests");
  return plainRequest;
}

export async function rejectResumeRequest(requestId, reason = "The request did not meet the current requirements.") {
  const admin = await requireRole("admin");
  await dbConnect();
  const request = await ResumeRequest.findByIdAndUpdate(
    requestId,
    { status: "REJECTED", rejectionReason: reason, decidedAt: new Date(), decidedBy: admin.id },
    { new: true },
  ).lean();
  if (!request) throw new Error("Resume request not found");

  const plainRequest = { ...toPlain(request), id: request._id.toString() };
  try {
    await sendRequestEmail({ request: plainRequest, type: "rejected", reason });
  } catch (error) {
    console.error("Resume rejection email failed:", error);
  }
  revalidatePath("/admin/resume-requests");
  return plainRequest;
}

export async function deleteResumeRequest(requestId) {
  await requireRole("admin");
  await dbConnect();
  await ResumeRequest.findByIdAndDelete(requestId);
  revalidatePath("/admin/resume-requests");
  return { success: true };
}

export async function hasApprovedResumeAccess(playerId) {
  const authUser = await requireAuth();
  await dbConnect();
  const request = await ResumeRequest.exists({ requesterId: authUser.id, playerId, requestType: "PROFILE", status: "APPROVED" });
  return Boolean(request);
}

export async function getPlayerAccess(playerId) {
  const authUser = await requireAuth();
  await dbConnect();
  const player = await Player.findById(playerId).select("userId").lean();
  if (!player) return { profileAccess: false, cvAccess: false };
  if (authUser.role === "admin") return { profileAccess: true, cvAccess: true };

  const isOwner = player.userId?.toString() === authUser.id;
  const [profileRequest, cvRequest] = await Promise.all([
    ResumeRequest.exists({ requesterId: authUser.id, playerId, requestType: "PROFILE", status: "APPROVED" }),
    ResumeRequest.exists({ requesterId: authUser.id, playerId, requestType: "CV", status: "APPROVED" }),
  ]);
  return { profileAccess: isOwner || Boolean(profileRequest), cvAccess: Boolean(cvRequest) };
}
