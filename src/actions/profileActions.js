"use server";

import {
  User,
  Order,
  Subscription,
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

    const [orders, subscriptions, paymentMethods, submissions] =
      await Promise.all([
        Order.find({ userId: user.id }).lean().sort({ createdAt: -1 }),
        Subscription.find({ userId: user.id }).lean().sort({ startedAt: -1 }),
        PaymentMethod.find({ userId: user.id }).lean(),
        Submission.find({ userId: user.id }).lean().sort({ submittedAt: -1 }),
      ]);

    return {
      ...normalize(userProfile),
      orders: orders.map((order) => ({
        ...normalize(order),
        items: order.items || [],
      })),
      subscriptions: subscriptions.map((sub) => ({
        ...normalize(sub),
        startedAt: sub.startedAt
          ? new Date(sub.startedAt).toISOString()
          : null,
        expiresAt: sub.expiresAt ? new Date(sub.expiresAt).toISOString() : null,
      })),
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
  await dbConnect();
  try {
    const user = await getAuthUser();
    if (!user?.id) return { orders: [], totalPages: 0, currentPage: 1 };

    const skip = (page - 1) * limit;
    const [orders, totalCount] = await Promise.all([
      Order.find({ userId: user.id })
        .lean()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ userId: user.id }),
    ]);

    return {
      orders: orders.map((order) => ({
        ...normalize(order),
        items: order.items || [],
      })),
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { orders: [], totalPages: 0, currentPage: 1 };
  }
}

// 💳 Get user subscriptions
export async function getUserSubscriptions() {
  await dbConnect();
  try {
    const user = await getAuthUser();
    if (!user?.id) return [];

    const subscriptions = await Subscription.find({ userId: user.id })
      .lean()
      .sort({ startedAt: -1 });

    return subscriptions.map((sub) => ({
      ...normalize(sub),
      startedAt: sub.startedAt
        ? new Date(sub.startedAt).toISOString()
        : null,
      expiresAt: sub.expiresAt ? new Date(sub.expiresAt).toISOString() : null,
    }));
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    return [];
  }
}

// 🔁 Update a user subscription
export async function updateUserSubscription(subscriptionId, isActive) {
  await dbConnect();
  try {
    const user = await getAuthUser();
    if (!user?.id)
      return { success: false, error: "User not authenticated" };

    const result = await Subscription.updateOne(
      { _id: subscriptionId, userId: user.id },
      { isActive }
    );

    if (result.matchedCount === 0)
      return { success: false, error: "Subscription not found or unauthorized" };

    return { success: true };
  } catch (error) {
    console.error("Error updating subscription:", error);
    return { success: false, error: "Failed to update subscription" };
  }
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
  await dbConnect();
  try {
    const user = await getAuthUser();
    if (!user?.id)
      return { success: false, error: "User not authenticated" };

    const order = await Order.findOne({
      _id: orderId,
      userId: user.id,
      status: "pending",
    }).lean();

    if (!order)
      return {
        success: false,
        error: "Order not found or cannot be cancelled",
      };

    const result = await Order.updateOne(
      { _id: orderId },
      { status: "cancelled" }
    );

    if (result.matchedCount === 0)
      return { success: false, error: "Order not found" };

    return { success: true };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return { success: false, error: "Failed to cancel order" };
  }
}
