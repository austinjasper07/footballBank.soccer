// // /api/auth/check/route.js

// import { NextResponse } from "next/server";
// import { getAuthUser } from "@/lib/oauth";

// export async function GET() {
//   try {
//     console.log("🔍 Auth check called");
    
//     // Set a shorter timeout for the authentication check
//     const timeoutPromise = new Promise((_, reject) => {
//       setTimeout(() => reject(new Error('Authentication check timeout')), 3000);
//     });
    
//     const authPromise = getAuthUser();
    
//     const user = await Promise.race([authPromise, timeoutPromise]);
    
//     console.log("🔍 Auth check result:", { user: user ? 'found' : 'null' });
    
//     if (user) {
//       return NextResponse.json({
//         authenticated: true,
//         user: user
//       });
//     } else {
//       return NextResponse.json({
//         authenticated: false,
//         user: null
//       });
//     }
//   } catch (error) {
//     console.error("Error checking authentication:", error);
//     return NextResponse.json(
//       { authenticated: false, user: null },
//       { status: 200 }
//     );
//   }
// }


// /api/auth/check/route.js
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";

export async function GET() {
  try {
    console.log("🔍 Auth check called");

    // Try to get user (don't race against an artificial timeout here)
    const user = await getAuthUser();

    console.log("🔍 Auth check result:", { user: user ? 'found' : 'null' });

    return NextResponse.json({
      authenticated: !!user,
      user: user || null,
    });
  } catch (error) {
    console.error("Error checking authentication:", error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200 }
    );
  }
}
