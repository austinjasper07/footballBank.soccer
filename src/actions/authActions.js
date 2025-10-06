"use server";

import { User, OtpToken, Session } from "@/lib/schemas";
import { sendOTPEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const OTP_EXPIRY_MINUTES = 10;
const SESSION_EXPIRY_DAYS = 30;

// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate session token
function generateSessionToken() {
  return jwt.sign(
    { timestamp: Date.now() },
    JWT_SECRET,
    { expiresIn: `${SESSION_EXPIRY_DAYS}d` }
  );
}

// Clean expired OTPs
async function cleanExpiredOTPs() {
  await dbConnect();
  try {
    await OtpToken.deleteMany({
      expiresAt: { $lt: new Date() }
    });
  } catch (error) {
    console.error("Error cleaning expired OTPs:", error);
  }
}

// Clean expired sessions
async function cleanExpiredSessions() {
  await dbConnect();
  try {
    await Session.deleteMany({
      expiresAt: { $lt: new Date() }
    });
  } catch (error) {
    console.error("Error cleaning expired sessions:", error);
  }
}

// Send OTP for login
export async function sendLoginOTP(email) {
  await dbConnect();
  try {
    // Clean expired OTPs first
    await cleanExpiredOTPs();

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: "No account found with this email address"
      };
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Save OTP to database
    await OtpToken.create({
      userId: user._id,
      email,
      token: otp,
      type: "LOGIN",
      status: "PENDING",
      expiresAt
    });

    // Send email
    await sendOTPEmail(email, otp, "login");

    return {
      success: true,
      message: "Login code sent to your email"
    };
  } catch (error) {
    console.error("Error sending login OTP:", error);
    return {
      success: false,
      error: "Failed to send login code. Please try again."
    };
  }
}

// Send OTP for signup
export async function sendSignupOTP(email, firstName, lastName) {
  await dbConnect();
  try {
    // Clean expired OTPs first
    await cleanExpiredOTPs();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists"
      };
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Save OTP to database (without userId since user doesn't exist yet)
    await OtpToken.create({
      email,
      token: otp,
      type: "SIGNUP",
      status: "PENDING",
      expiresAt
    });

    // Send email
    await sendOTPEmail(email, otp, "signup");

    return {
      success: true,
      message: "Verification code sent to your email"
    };
  } catch (error) {
    console.error("Error sending signup OTP:", error);
    return {
      success: false,
      error: "Failed to send verification code. Please try again."
    };
  }
}

// Verify OTP and login
export async function verifyLoginOTP(email, otp) {
  await dbConnect();
  try {
    // Find valid OTP
    const otpRecord = await OtpToken.findOne({
      email,
      token: otp,
      type: "LOGIN",
      status: "PENDING",
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return {
        success: false,
        error: "Invalid or expired verification code"
      };
    }

    // Get user details
    const user = await User.findById(otpRecord.userId);

    if (!user) {
      return {
        success: false,
        error: "User not found"
      };
    }

    // Mark OTP as verified
    await OtpToken.findByIdAndUpdate(otpRecord._id, {
      status: "VERIFIED",
      verifiedAt: new Date()
    });

    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await Session.create({
      userId: user._id,
      token: sessionToken,
      expiresAt
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60
    });

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified
      }
    };
  } catch (error) {
    console.error("Error verifying login OTP:", error);
    return {
      success: false,
      error: "Failed to verify code. Please try again."
    };
  }
}

// Verify OTP and create account
export async function verifySignupOTP(email, otp, firstName, lastName) {
  await dbConnect();
  try {
    // Find valid OTP
    const otpRecord = await OtpToken.findOne({
      email,
      token: otp,
      type: "SIGNUP",
      status: "PENDING",
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return {
        success: false,
        error: "Invalid or expired verification code"
      };
    }

    // Mark OTP as verified
    await OtpToken.findByIdAndUpdate(otpRecord._id, {
      status: "VERIFIED",
      verifiedAt: new Date()
    });

    // Create user
    const user = await User.create({
      email,
      firstName,
      lastName,
      role: "user",
      subscribed: false,
      isVerified: true
    });

    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await Session.create({
      userId: user._id,
      token: sessionToken,
      expiresAt
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60
    });

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email,
        firstName,
        lastName,
        role: "user",
        isVerified: true
      }
    };
  } catch (error) {
    console.error("Error verifying signup OTP:", error);
    return {
      success: false,
      error: "Failed to create account. Please try again."
    };
  }
}

// Get current user from session
export async function getCurrentUser() {
  await dbConnect();
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return null;
    }

    // Verify session token
    const decoded = jwt.verify(sessionToken, JWT_SECRET);
    
    // Find session in database
    const session = await Session.findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return null;
    }

    // Get user details
    const user = await User.findById(session.userId);

    if (!user) {
      return null;
    }

    // Update last used
    await Session.findByIdAndUpdate(session._id, {
      lastUsed: new Date()
    });

    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Logout user
export async function logout() {
  await dbConnect();
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (sessionToken) {
      // Delete session from database
      await Session.deleteMany({ token: sessionToken });
    }

    // Clear session cookie
    cookieStore.delete("session");

    return { success: true };
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, error: "Failed to logout" };
  }
}

// Send password reset OTP
export async function sendPasswordResetOTP(email) {
  await dbConnect();
  try {
    // Clean expired OTPs first
    await cleanExpiredOTPs();

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: "No account found with this email address"
      };
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Save OTP to database
    await OtpToken.create({
      userId: user._id,
      email,
      token: otp,
      type: "PASSWORD_RESET",
      status: "PENDING",
      expiresAt
    });

    // Send email
    await sendOTPEmail(email, otp, "reset");

    return {
      success: true,
      message: "Password reset code sent to your email"
    };
  } catch (error) {
    console.error("Error sending password reset OTP:", error);
    return {
      success: false,
      error: "Failed to send reset code. Please try again."
    };
  }
}

// Verify password reset OTP and reset password
export async function resetPasswordWithOTP(email, otp, newPassword) {
  await dbConnect();
  try {
    // Find valid OTP
    const otpRecord = await OtpToken.findOne({
      email,
      token: otp,
      type: "PASSWORD_RESET",
      status: "PENDING",
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return {
        success: false,
        error: "Invalid or expired verification code"
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await User.findByIdAndUpdate(otpRecord.userId, {
      password: hashedPassword,
      updatedAt: new Date()
    });

    // Mark OTP as verified
    await OtpToken.findByIdAndUpdate(otpRecord._id, {
      status: "VERIFIED",
      verifiedAt: new Date()
    });

    return {
      success: true,
      message: "Password reset successfully"
    };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      error: "Failed to reset password. Please try again."
    };
  }
}

// Clean up expired tokens and sessions
export async function cleanupExpiredTokens() {
  await dbConnect();
  try {
    await Promise.all([
      cleanExpiredOTPs(),
      cleanExpiredSessions()
    ]);
    return { success: true };
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
    return { success: false };
  }
}
