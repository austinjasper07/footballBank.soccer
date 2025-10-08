// // lib/oauth.js

// import { cookies } from "next/headers";
// import { Session, User } from "./schemas";
// import dbConnect from "./mongodb";

// export async function getAuthUser() {
//   await dbConnect();
//   try {
//     // Only use OTP session (no NextAuth to avoid openid-client issues)
//     const cookieStore = await cookies();
//     const sessionToken = cookieStore.get("session")?.value;
    
//     console.log("🔍 getAuthUser - sessionToken:", sessionToken ? 'found' : 'not found');

//     if (sessionToken && sessionToken.trim() !== '') {
//       try {
//         // Find session in database
//         const sessionRecord = await Session.findOne({
//           token: sessionToken,
//           expiresAt: { $gt: new Date() }
//         });

//         if (sessionRecord) {
//           // Get user details
//           const user = await User.findById(sessionRecord.userId);
          
//           if (user) {
//             // Update last used timestamp (non-blocking)
//             Session.findByIdAndUpdate(
//               sessionRecord._id, 
//               { lastUsed: new Date() }
//             ).catch(err => console.error("Error updating session:", err));

//             return {
//               id: user._id.toString(),
//               email: user.email,
//               firstName: user.firstName,
//               lastName: user.lastName,
//               role: user.role,
//               isVerified: user.isVerified,
//               authMethod: 'otp'
//             };
//           } else {
//             console.log("🔍 Session found but user not found, cleaning up session");
//             // Clean up orphaned session
//             await Session.findByIdAndDelete(sessionRecord._id);
//           }
//         } else {
//           console.log("🔍 Session token not found or expired");
//         }
//       } catch (error) {
//         console.error("Error checking OTP session:", error.message || error);
//       }
//     }

//     return null;
//   } catch (error) {
//     console.error("Error getting auth user:", error);
//     return null;
//   }
// }

// export async function requireAuth() {
//   await dbConnect();
//   const user = await getAuthUser();
//   if (!user) {
//     throw new Error("Authentication required");
//   }
//   return user;
// }

// export async function requireRole(requiredRole) {
//   const user = await requireAuth();
//   if (user.role !== requiredRole && user.role !== 'admin') {
//     throw new Error(`Role ${requiredRole} required`);
//   }
//   return user;
// }

// lib/oauth.js
import { cookies } from "next/headers";
import { Session, User } from "./schemas";
import dbConnect from "./mongodb";

export async function getAuthUser() {
  await dbConnect();
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    console.log("🔍 getAuthUser - sessionToken:", sessionToken ? "found" : "not found");
    console.log("🔍 getAuthUser - sessionToken length:", sessionToken?.length || 0);

    if (!sessionToken) {
      console.log("🔍 No session token found");
      return null;
    }

    const sessionRecord = await Session.findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!sessionRecord) {
      console.log("🔍 Session not found or expired");
      return null;
    }

    const user = await User.findById(sessionRecord.userId).lean();
    if (!user) {
      console.log("🔍 Session found but user not found — cleaning up");
      await Session.deleteOne({ _id: sessionRecord._id });
      return null;
    }

    // Update lastUsed timestamp (non-blocking)
    Session.updateOne(
      { _id: sessionRecord._id },
      { $set: { lastUsed: new Date() } }
    ).catch(err => console.error("Error updating session:", err));

    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
      authMethod: "otp",
    };
  } catch (error) {
    console.error("Error getting auth user:", error);
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
