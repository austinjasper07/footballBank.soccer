import { NextResponse } from "next/server";
import { sendPasswordResetOTP } from "@/actions/authActions";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await sendPasswordResetOTP(email);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: result.message 
      });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to send reset code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Send password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

