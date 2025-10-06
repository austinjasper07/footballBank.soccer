import { cookies } from "next/headers";
import { Session, User } from "./schemas";

export async function getAuthUser() {
  try {
    // Only use OTP session (no NextAuth to avoid openid-client issues)
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    console.log("🔍 getAuthUser - sessionToken:", sessionToken ? 'found' : 'not found');

    if (sessionToken) {
      try {
        // Find session in database
        const sessionRecord = await Session.findOne({
          token: sessionToken,
          expiresAt: { $gt: new Date() }
        });

        if (sessionRecord) {
          // Get user details
          const user = await User.findById(sessionRecord.userId);
          
          if (user) {
            // Update last used timestamp (non-blocking)
            Session.findByIdAndUpdate(
              sessionRecord._id, 
              { lastUsed: new Date() }
            ).catch(err => console.error("Error updating session:", err));

            return {
              id: user._id.toString(),
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              isVerified: user.isVerified,
              authMethod: 'otp'
            };
          }
        }
      } catch (error) {
        console.error("Error checking OTP session:", error);
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting auth user:", error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireRole(requiredRole) {
  const user = await requireAuth();
  if (user.role !== requiredRole && user.role !== 'admin') {
    throw new Error(`Role ${requiredRole} required`);
  }
  return user;
}