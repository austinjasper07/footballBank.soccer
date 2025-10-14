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
      return NextResponse.json(
        { error: result.error || "Failed to send OTP" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
