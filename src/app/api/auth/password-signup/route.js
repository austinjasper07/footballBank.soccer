import { NextResponse } from "next/server";
import { signupWithPassword } from "@/actions/authActions";

export async function POST(req) {
  try {
    const { email, firstName, lastName, password, address, shippingAddress } = await req.json();

    if (!email || !firstName || !lastName || !password) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const result = await signupWithPassword(email, firstName, lastName, password, address, shippingAddress);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        user: result.user,
        message: "Account created successfully" 
      });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to create account" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Password signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

