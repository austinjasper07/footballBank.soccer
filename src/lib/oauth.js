import { cookies } from "next/headers";
import prisma from "./prisma";

export async function getAuthUser() {
  try {
    // Only use OTP session (no NextAuth to avoid openid-client issues)
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (sessionToken) {
      try {
        // Find session in database
        const sessionRecord = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date()
            }
          },
          include: {
            user: true
          }
        });

        if (sessionRecord && sessionRecord.user) {
          return {
            id: sessionRecord.user.id,
            email: sessionRecord.user.email,
            firstName: sessionRecord.user.firstName,
            lastName: sessionRecord.user.lastName,
            role: sessionRecord.user.role,
            isVerified: sessionRecord.user.isVerified,
            authMethod: 'otp'
          };
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