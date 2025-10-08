import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";

export async function GET() {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Return user wrapped in user property to match context expectations
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }
}