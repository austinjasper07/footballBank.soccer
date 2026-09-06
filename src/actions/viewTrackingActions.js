"use server";

import dbConnect from "@/lib/mongodb";
import { Player, PlayerProfileView, Post, User } from "@/lib/schemas";
import { getAuthUser } from "@/lib/oauth";
import { sendEmail } from "@/lib/email";
import { notifyAdmins } from "@/lib/adminNotifications";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://footballbank.soccer";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export async function incrementPostView(postId) {
  await dbConnect();
  const post = await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } }, { new: true }).select("views").lean();
  return post?.views || 0;
}

export async function trackPlayerProfileView(playerId, locale = "en") {
  const viewer = await getAuthUser();
  if (!viewer) return { tracked: false, reason: "anonymous" };

  await dbConnect();
  const [player, viewerRecord] = await Promise.all([
    Player.findById(playerId).select("firstName lastName email userId").lean(),
    User.findById(viewer.id).select("firstName lastName email").lean(),
  ]);
  if (!player || !viewerRecord || !player.email) return { tracked: false, reason: "missing-record" };
  if (player.userId?.toString() === viewer.id) return { tracked: false, reason: "owner" };

  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const existingView = await PlayerProfileView.findOne({ playerId, viewerId: viewer.id, viewedAt: { $gte: dayStart } }).lean();
  if (existingView) return { tracked: false, reason: "already-notified-today" };

  await PlayerProfileView.create({ playerId, viewerId: viewer.id });
  const playerName = `${player.firstName} ${player.lastName}`;
  const viewerName = `${viewerRecord.firstName} ${viewerRecord.lastName}`;
  const profileUrl = `${siteUrl}/${locale}/players/${playerId}`;

  try {
    await sendEmail({
      to: player.email,
      subject: `${viewerName} viewed your FootballBank profile`,
      text: `${viewerName} (${viewerRecord.email}) viewed your FootballBank profile. View your profile: ${profileUrl}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0b1220;max-width:600px;margin:auto"><h2>Someone viewed your profile</h2><p>Hello ${escapeHtml(playerName)},</p><p><strong>${escapeHtml(viewerName)}</strong> (${escapeHtml(viewerRecord.email)}) viewed your player profile on FootballBank International.</p><p><a href="${profileUrl}">View your profile</a></p><p>This notification is limited to one email per registered viewer each day.</p></div>`,
    });
  } catch (error) {
    console.error("Player profile view notification failed:", error);
  }

  try {
    await notifyAdmins({
      subject: `${viewerName} viewed ${playerName}'s profile`,
      title: "Registered user viewed a player profile",
      message: `${viewerName} (${viewerRecord.email}) viewed ${playerName}'s FootballBank profile.`,
      link: "/en/admin",
    });
  } catch (error) {
    console.error("Admin player view notification failed:", error);
  }

  return { tracked: true };
}
