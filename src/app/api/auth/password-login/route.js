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
      return NextResponse.json(
        { error: result.error || "Login failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Password login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

