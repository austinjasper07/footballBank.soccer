import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import { User } from "@/lib/schemas";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user notification preferences
    const userData = await User.findById(user.id)
      .select('notificationPreferences');

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return default preferences if not set
    const preferences = userData.notificationPreferences || {
      email: true,
      sms: false,
      push: true,
      marketing: false
    };

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error getting notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await dbConnect();
    
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { email, sms, push, marketing } = body;

    // Validate that at least one preference is provided
    if (typeof email !== 'boolean' && typeof sms !== 'boolean' && 
        typeof push !== 'boolean' && typeof marketing !== 'boolean') {
      return NextResponse.json(
        { error: "At least one notification preference must be provided" },
        { status: 400 }
      );
    }

    // Build update object with only provided preferences
    const updateObj = {
      updatedAt: new Date()
    };

    if (typeof email === 'boolean') updateObj['notificationPreferences.email'] = email;
    if (typeof sms === 'boolean') updateObj['notificationPreferences.sms'] = sms;
    if (typeof push === 'boolean') updateObj['notificationPreferences.push'] = push;
    if (typeof marketing === 'boolean') updateObj['notificationPreferences.marketing'] = marketing;

    // Update notification preferences
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $set: updateObj },
      { new: true }
    ).select('notificationPreferences');

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Notification preferences updated successfully",
      preferences: updatedUser.notificationPreferences
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}

