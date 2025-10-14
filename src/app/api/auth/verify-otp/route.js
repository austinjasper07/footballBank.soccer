import { NextResponse } from "next/server";
import { verifyLoginOTP } from "@/actions/authActions";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const result = await verifyLoginOTP(email, otp);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        user: result.user,
        message: "Login successful" 
      });
    } else {
      return NextResponse.json(
        { error: result.error || "Invalid OTP" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
