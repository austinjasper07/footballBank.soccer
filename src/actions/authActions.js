
"use server";

import { User, OtpToken, Subscription } from "@/lib/schemas";
import { sendOTPEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const OTP_EXPIRY_MINUTES = 10;
const SESSION_EXPIRY_DAYS = 30;

/** ---------- Helpers ---------- **/

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Generate session JWT with user data embedded
const generateSessionToken = (user) =>
  jwt.sign({
    userId: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isVerified: user.isVerified,
    authMethod: "otp",
    iat: Math.floor(Date.now() / 1000),
  }, JWT_SECRET, { expiresIn: `${SESSION_EXPIRY_DAYS}d` });

// Clean expired OTPs (sessions are now stateless JWT tokens)
const cleanExpiredOTPs = async () => {
  await OtpToken.deleteMany({ expiresAt: { $lt: new Date() } }).catch(console.error);
};

/** ---------- Password Authentication ---------- **/

// Login with email and password
export async function loginWithPassword(email, password) {
  await dbConnect();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, error: "No account found with this email address" };
    }

    // Check if user has a password set
    if (!user.password) {
      return { 
        success: false, 
        error: "Password not set for this account. Please use OTP login or set a password first." 
      };
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return { success: false, error: "Invalid password" };
    }

    // Generate session token
    const sessionToken = generateSessionToken(user);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 86400,
      path: "/",
    });

    console.log("🔐 Password login successful for user:", user.email);

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  } catch (error) {
    console.error("Error in password login:", error);
    return { success: false, error: "Login failed. Please try again." };
  }
}

// Set password for user (during signup or password setup)
export async function setUserPassword(email, password) {
  await dbConnect();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user with password
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      updatedAt: new Date()
    });

    return { success: true, message: "Password set successfully" };
  } catch (error) {
    console.error("Error setting password:", error);
    return { success: false, error: "Failed to set password. Please try again." };
  }
}

// Change password for authenticated user
export async function changePassword(userId, currentPassword, newPassword) {
  await dbConnect();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    
    if (!isValidPassword) {
      return { success: false, error: "Current password is incorrect" };
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
      updatedAt: new Date()
    });

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, error: "Failed to change password. Please try again." };
  }
}

// Signup with password (alternative to OTP signup)
export async function signupWithPassword(email, firstName, lastName, password, address, shippingAddress) {
  await dbConnect();
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, error: "Account with this email already exists" };
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with password
    const userData = {
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role: "user",
      isVerified: true,
      address,
      shippingAddress
    };

    const user = await User.create(userData);

    /** ---------- 🎁 Activate 3-Month Free Subscription ---------- **/
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 3 months

      const subscription = await Subscription.create({
        userId: user._id,
        type: "player_publication",
        plan: "free",
        isActive: true,
        startedAt: now,
        expiresAt,
        stripeSubId: null, // no Stripe for free plan
      });

      await subscription.save();

      // Update user's subscription status
      user.subscribed = true;
      await user.save();

      console.log(`✅ Activated 3-month free subscription for ${email}`);
    } catch (subError) {
      console.error("❌ Failed to activate free subscription:", subError);
    }
    /** ---------------------------------------------------------- **/

    // Generate session token
    const sessionToken = generateSessionToken(user);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 86400,
      path: "/",
    });

    console.log("🔐 Password signup successful for user:", email);

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email,
        firstName,
        lastName,
        role: "user",
        isVerified: true,
      },
    };
  } catch (error) {
    console.error("Error in password signup:", error);
    return { success: false, error: "Failed to create account. Please try again." };
  }
}

// Password recovery - send reset OTP
export async function sendPasswordResetOTP(email) {
  await dbConnect();
  try {
    await cleanExpiredOTPs();

    const user = await User.findOne({ email });
    if (!user) return { success: false, error: "No account found with this email address" };

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OtpToken.create({
      userId: user._id,
      email,
      token: otp,
      type: "PASSWORD_RESET",
      status: "PENDING",
      expiresAt,
    });

    await sendOTPEmail(email, otp, "reset");

    return { success: true, message: "Password reset code sent to your email" };
  } catch (error) {
    console.error("Error sending password reset OTP:", error);
    return { success: false, error: "Failed to send reset code. Please try again." };
  }
}

// Reset password with OTP
export async function resetPasswordWithOTP(email, otp, newPassword) {
  await dbConnect();
  try {
    const otpRecord = await OtpToken.findOne({
      email,
      token: otp,
      type: "PASSWORD_RESET",
      status: "PENDING",
      expiresAt: { $gt: new Date() },
    });
    if (!otpRecord) return { success: false, error: "Invalid or expired verification code" };

    const hashed = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(otpRecord.userId, { password: hashed, updatedAt: new Date() });

    otpRecord.status = "VERIFIED";
    otpRecord.verifiedAt = new Date();
    await otpRecord.save();

    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Failed to reset password. Please try again." };
  }
}

/** ---------- OTP & Auth Actions ---------- **/

// Send OTP for login
export async function sendLoginOTP(email) {
  try {
    console.log("🔍 Starting sendLoginOTP for email:", email);
    console.log("🔍 Environment check:");
    console.log("- JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log("- RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
    console.log("- DATABASE_URL exists:", !!process.env.DATABASE_URL);
    
    await dbConnect();
    console.log("🔍 Database connected successfully");

    await cleanExpiredOTPs();
    console.log("🔍 Cleaned expired OTPs");

    const user = await User.findOne({ email });
    console.log("🔍 User lookup result:", user ? "User found" : "User not found");
    
    if (!user) {
      console.log("🔍 No user found for email:", email);
      return { success: false, error: "No account found with this email address" };
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    console.log("🔍 Generated OTP:", otp, "Expires at:", expiresAt);

    const otpRecord = await OtpToken.create({ 
      userId: user._id, 
      email, 
      token: otp, 
      type: "LOGIN", 
      status: "PENDING", 
      expiresAt 
    });
    console.log("🔍 OTP record created:", otpRecord._id);

    console.log("🔍 Attempting to send email...");
    const emailResult = await sendOTPEmail(email, otp, "login");
    console.log("🔍 Email send result:", emailResult);

    return { success: true, message: "Login code sent to your email" };
  } catch (error) {
    console.error("🔍 Error sending login OTP:", error);
    console.error("🔍 Error stack:", error.stack);
    return { 
      success: false, 
      error: "Failed to send login code. Please try again.",
      debug: error.message
    };
  }
}

// Send OTP for signup
export async function sendSignupOTP(email, firstName, lastName) {
  await dbConnect();
  try {
    await cleanExpiredOTPs();

    const existing = await User.findOne({ email });
    if (existing) return { success: false, error: "Account with this email already exists" };

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OtpToken.create({ email, token: otp, type: "SIGNUP", status: "PENDING", expiresAt });
    await sendOTPEmail(email, otp, "signup");

    return { success: true, message: "Verification code sent to your email" };
  } catch (error) {
    console.error("Error sending signup OTP:", error);
    return { success: false, error: "Failed to send verification code. Please try again." };
  }
}

// Verify login OTP
export async function verifyLoginOTP(email, otp) {
  await dbConnect();
  try {
    const otpRecord = await OtpToken.findOne({
      email,
      token: otp,
      type: "LOGIN",
      status: "PENDING",
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) return { success: false, error: "Invalid or expired verification code" };

    const user = await User.findById(otpRecord.userId);
    if (!user) return { success: false, error: "User not found" };

    otpRecord.status = "VERIFIED";
    otpRecord.verifiedAt = new Date();
    await otpRecord.save();

    const sessionToken = generateSessionToken(user);

    // Set session cookie with JWT containing user data (NO DATABASE SESSION STORAGE)
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 86400,
      path: "/", // Ensure cookie is available for all paths
    });

    console.log("🔐 Session created and cookie set for user:", user.email);

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  } catch (error) {
    console.error("Error verifying login OTP:", error);
    return { success: false, error: "Failed to verify code. Please try again." };
  }
}

// Verify signup OTP and create user
export async function verifySignupOTP(email, otp, firstName, lastName, address, shippingAddress) {
  await dbConnect();
  try {
    const otpRecord = await OtpToken.findOne({
      email,
      token: otp,
      type: "SIGNUP",
      status: "PENDING",
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) return { success: false, error: "Invalid or expired verification code" };

    otpRecord.status = "VERIFIED";
    otpRecord.verifiedAt = new Date();
    await otpRecord.save();

    // ✅ Create new user
    const userData = {
      email,
      firstName,
      lastName,
      role: "user",
      isVerified: true,
      address,
      shippingAddress,
      subscribed: false, // default
    };

    const user = await User.create(userData);

    /** ---------- 🎁 Activate 3-Month Free Subscription ---------- **/
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 3 months
      const stripeSubId = `free-${user._id.toString()}-${Date.now()}`; // Dummy ID for free plan

      const subscription = await Subscription.create({
        userId: user._id,
        type: "player_publication",
        plan: "free",
        isActive: true,
        startedAt: now,
        expiresAt,
        stripeSubId, // no Stripe for free plan
      });

      await subscription.save();

      // Update user's subscription status
      user.subscribed = true;
      await user.save();

      console.log(`✅ Activated 3-month free subscription for ${email}`);
    } catch (subError) {
      console.error("❌ Failed to activate free subscription:", subError);
    }
    /** ---------------------------------------------------------- **/

    // ✅ Create session token
    const sessionToken = generateSessionToken(user);
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 86400,
      path: "/",
    });


    return {
      success: true,
      user: {
        id: user._id.toString(),
        email,
        firstName,
        lastName,
        role: "user",
        isVerified: true,
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to create account. Please try again." };
  }
}



/** ---------- Session Management ---------- **/

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return null;

    // Verify JWT token directly (NO DATABASE QUERY)
    const decoded = jwt.verify(sessionToken, JWT_SECRET);
    
    // Validate required fields in JWT
    if (!decoded.userId || !decoded.email) {
      console.log("Invalid JWT payload - missing required fields, clearing token");
      // Clear the invalid token
      try {
        const store = await cookies();
        store.delete("session");
      } catch (clearError) {
        console.log("Could not clear invalid token:", clearError.message);
      }
      return null;
    }

    // Return user data directly from JWT (NO DATABASE QUERY)
    return {
      id: decoded.userId,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role,
      isVerified: decoded.isVerified,
    };
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.log("Invalid JWT token, clearing cookie");
      // Clear invalid token
      try {
        const store = await cookies();
        store.delete("session");
      } catch (clearError) {
        console.log("Could not clear invalid token:", clearError.message);
      }
    } else if (error.name === 'TokenExpiredError') {
      console.log("JWT token expired, clearing cookie");
      // Clear expired token
      try {
        const store = await cookies();
        store.delete("session");
      } catch (clearError) {
        console.log("Could not clear expired token:", clearError.message);
      }
    } else {
      console.error("JWT verification error:", error.message);
    }
    return null;
  }
}

export async function logout() {
  try {
    // Simply clear the session cookie (NO DATABASE OPERATIONS NEEDED)
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return { success: true };
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, error: "Failed to logout" };
  }
}


/** ---------- Maintenance ---------- **/
export async function cleanupExpiredTokens() {
  await dbConnect();
  try {
    // Only clean OTPs since sessions are now stateless JWT tokens
    await cleanExpiredOTPs();
    return { success: true };
  } catch (error) {
    console.error("Error cleaning expired tokens:", error);
    return { success: false };
  }
}