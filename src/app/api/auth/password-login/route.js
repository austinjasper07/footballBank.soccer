import { NextResponse } from "next/server";
import { loginWithPassword } from "@/actions/authActions";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await loginWithPassword(email, password);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        user: result.user,
        message: "Login successful" 
      });
    } else {
      const status = result.code === "ACCOUNT_LOCKED" ? 423 : result.code === "RATE_LIMITED" ? 429 : 400;
      return NextResponse.json({ error: result.error || "Login failed", code: result.code }, { status });
    }
  } catch (error) {
    console.error("Password login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

