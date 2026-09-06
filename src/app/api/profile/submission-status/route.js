import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import dbConnect from "@/lib/mongodb";
import { Player, Submission } from "@/lib/schemas";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ canSubmit: false, reason: "unauthenticated" }, { status: 401 });

    await dbConnect();
    const [player, submission] = await Promise.all([
      Player.findOne({ $or: [{ userId: user.id }, { email: user.email }] }).select("_id").lean(),
      Submission.findOne({ userId: user.id, status: { $in: ["PENDING", "APPROVED"] } }).select("status").sort({ submittedAt: -1 }).lean(),
    ]);

    if (player) return NextResponse.json({ canSubmit: false, reason: "player-profile-exists" });
    if (submission) return NextResponse.json({ canSubmit: false, reason: submission.status.toLowerCase() });
    return NextResponse.json({ canSubmit: true });
  } catch (error) {
    console.error("Error checking submission status:", error);
    return NextResponse.json({ canSubmit: true }, { status: 200 });
  }
}
