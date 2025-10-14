import { getCurrentPlayerProfile } from "@/actions/profileActions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const player = await getCurrentPlayerProfile();
    
    if (!player) {
      return NextResponse.json(
        { error: "Player profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error("Error fetching player profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
