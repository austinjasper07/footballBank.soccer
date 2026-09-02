"use server";

import {
  User,
  PaymentMethod,
  Submission,
  Player,
} from "@/lib/schemas";
import { getAuthUser } from "@/lib/oauth";
import dbConnect from "@/lib/mongodb";

// 🧩 Helper — Normalize MongoDB documents into plain serializable objects
const normalize = (doc) => ({
  ...doc,
  id: doc._id?.toString(),
  _id: undefined,
  createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
  updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
});

// 🧍‍♂️ Get current user's full profile
export async function getCurrentUserProfile() {
  await dbConnect();
  try {
    const user = await getAuthUser();
    if (!user?.id) return null;

    const userProfile = await User.findById(user.id).lean();
    if (!userProfile) return null;

    const [paymentMethods, submissions] =
      await Promise.all([
        PaymentMethod.find({ userId: user.id }).lean(),
        Submission.find({ userId: user.id }).lean().sort({ submittedAt: -1 }),
      ]);

    return {
      ...normalize(userProfile),
      orders: [],
      subscriptions: [],
      paymentMethods: paymentMethods.map((pm) => normalize(pm)),
      submissions: submissions.map((sub) => ({
        ...normalize(sub),
        submittedAt: sub.submittedAt
          ? new Date(sub.submittedAt).toISOString()
          : null,
      })),
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

// 📦 Get user's orders (with pagination)
export async function getUserOrders(page = 1, limit = 10) {
  return { orders: [], totalPages: 0, currentPage: page, totalCount: 0 };
}

// 💳 Get user subscriptions
export async function getUserSubscriptions() {
  return [];
}

// 🔁 Update a user subscription
export async function updateUserSubscription(subscriptionId, isActive) {
  return { success: false, error: "Subscriptions are disabled" };
}

// ⚽ Get player profile by ID
export async function getPlayerProfile(playerId) {
  await dbConnect();
  try {
    const player = await Player.findById(playerId).lean();
    if (!player) return null;

    return {
      ...normalize(player),
      stats: player.stats || null,
      clubHistory: player.clubHistory || null,
    };
  } catch (error) {
    console.error("Error fetching player profile:", error);
    return null;
  }
}

// ⚽ Get current user's player profile
export async function getCurrentPlayerProfile() {
  await dbConnect();
  try {
    const user = await getAuthUser();
    if (!user?.id || user.role !== "player") return null;

    const player = await Player.findOne({ email: user.email }).lean();
    if (!player) return null;

    return {
      ...normalize(player),
      stats: player.stats || null,
      clubHistory: player.clubHistory || null,
    };
  } catch (error) {
    console.error("Error fetching current player profile:", error);
    return null;
  }
}

// ✏️ Update player profile
export async function updatePlayerProfile(playerId, data) {
  await dbConnect();
  try {
    const user = await getAuthUser();
    if (!user?.id)
      return { success: false, error: "User not authenticated" };

    const player = await Player.findById(playerId).lean();
    if (!player || player.email !== user.email)
      return { success: false, error: "Unauthorized to update this profile" };

    const updateData = { ...data, updatedAt: new Date() };
    const result = await Player.updateOne({ _id: playerId }, updateData);

    if (result.matchedCount === 0)
      return { success: false, error: "Player profile not found" };

    return { success: true };
  } catch (error) {
    console.error("Error updating player profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

// ❌ Cancel order
export async function cancelOrder(orderId) {
  return { success: false, error: "Orders are disabled" };
}
