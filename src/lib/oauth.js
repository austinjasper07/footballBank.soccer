
// lib/oauth.js
import { cookies } from "next/headers";
import { User } from "./schemas";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Helper function to debug JWT tokens
function debugJWTToken(token) {
  try {
    // Decode without verification to see payload structure
    const decoded = jwt.decode(token);
    console.log("🔍 JWT Debug - Token payload:", {
      hasUserId: !!decoded?.userId,
      hasEmail: !!decoded?.email,
      hasFirstName: !!decoded?.firstName,
      hasLastName: !!decoded?.lastName,
      hasRole: !!decoded?.role,
      payloadKeys: Object.keys(decoded || {}),
      iat: decoded?.iat,
      exp: decoded?.exp
    });
    return decoded;
  } catch (error) {
    console.log("🔍 JWT Debug - Could not decode token:", error.message);
    return null;
  }
}

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return null;
    }

    // Verify JWT token directly (NO DATABASE QUERY)
    const decoded = jwt.verify(sessionToken, JWT_SECRET);
    
    // Validate required fields in JWT
    if (!decoded.userId || !decoded.email) {
      try {
        const cookieStore = await cookies();
        cookieStore.delete("session");
      } catch (clearError) {
        console.log("Could not clear invalid token:", clearError.message);
      }
      return null;
    }

    return {
      id: decoded.userId,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role,
      isVerified: decoded.isVerified,
      authMethod: decoded.authMethod,
    };
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.log("🔍 Invalid JWT token, clearing cookie");
      // Clear invalid token
      try {
        const cookieStore = await cookies();
        cookieStore.delete("session");
      } catch (clearError) {
        console.log("Could not clear invalid token:", clearError.message);
      }
    } else if (error.name === 'TokenExpiredError') {
      console.log("🔍 JWT token expired, clearing cookie");
      // Clear expired token
      try {
        const cookieStore = await cookies();
        cookieStore.delete("session");
      } catch (clearError) {
        console.log("Could not clear expired token:", clearError.message);
      }
    } else {
      console.error("🔍 JWT verification error:", error.message);
    }
    return null;
  }
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) throw new Error("Authentication required");
  return user;
}

export async function requireRole(requiredRole) {
  const user = await requireAuth();
  if (user.role !== requiredRole && user.role !== "admin") {
    throw new Error(`Role ${requiredRole} required`);
  }
  return user;
}
