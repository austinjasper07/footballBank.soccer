import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import { User } from "@/lib/schemas";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user with additional data
    const userData = await User.findById(user.id)
      .select('firstName lastName email role isVerified createdAt');

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error getting user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}