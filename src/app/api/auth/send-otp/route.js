import { NextResponse } from "next/server";
import { sendLoginOTP } from "@/actions/authActions";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await sendLoginOTP(email);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: "OTP sent successfully" 
      });
    } else {
      const status = result.code === "ACCOUNT_LOCKED" ? 423 : result.code === "RATE_LIMITED" ? 429 : 400;
      return NextResponse.json({ error: result.error || "Failed to send OTP", code: result.code }, { status });
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
