import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import dbConnect from "@/lib/mongodb";
import { Player, ResumeRequest } from "@/lib/schemas";
import { generatePlayerResumePdf } from "@/lib/playerResume";

export async function GET(_request, { params }) {
  const authUser = await getAuthUser();
  if (!authUser) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  await dbConnect();
  const player = await Player.findById(id).lean();
  if (!player) return new Response("Player not found", { status: 404 });

  const isAdmin = authUser.role === "admin";
  const isOwner = player.userId?.toString() === authUser.id;
  const approvedRequest = await ResumeRequest.exists({
    requesterId: authUser.id,
    playerId: id,
    requestType: "CV",
    status: "APPROVED",
  });

  if (!isAdmin && !approvedRequest) {
    return new Response(isOwner ? "Resume request approval required" : "Resume access not approved", { status: 403 });
  }

  const filename = `${player.firstName}-${player.lastName}-resume.pdf`.replace(/[^a-z0-9.-]+/gi, "-").toLowerCase();
  const pdf = await generatePlayerResumePdf(player);
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
