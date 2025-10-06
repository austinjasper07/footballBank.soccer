"use server";

import { User, Order, Subscription, PaymentMethod, Submission, Player } from "@/lib/schemas";
import { getAuthUser } from "@/lib/oauth";

// Get current user's profile data
export async function getCurrentUserProfile() {
  try {
    const user = await getAuthUser();

    if (!user?.id) {
      return null;
    }

    const userProfile = await User.findById(user.id);
    
    if (!userProfile) {
      return null;
    }

    // Get related data
    const [orders, subscriptions, paymentMethods, submissions] = await Promise.all([
      Order.find({ userId: user.id }).sort({ createdAt: -1 }),
      Subscription.find({ userId: user.id }).sort({ startedAt: -1 }),
      PaymentMethod.find({ userId: user.id }),
      Submission.find({ userId: user.id }).sort({ submittedAt: -1 })
    ]);

    return {
      ...userProfile.toObject(),
      id: userProfile._id.toString(),
      orders: orders.map(order => ({
        ...order.toObject(),
        id: order._id.toString(),
        createdAt: order.createdAt.toISOString(),
        items: order.items || []
      })),
      subscriptions: subscriptions.map(sub => ({
        ...sub.toObject(),
        id: sub._id.toString(),
        startedAt: sub.startedAt.toISOString(),
        expiresAt: sub.expiresAt.toISOString()
      })),
      paymentMethods: paymentMethods.map(pm => ({
        ...pm.toObject(),
        id: pm._id.toString(),
        createdAt: pm.createdAt.toISOString()
      })),
      Submission: submissions.map(sub => ({
        ...sub.toObject(),
        id: sub._id.toString(),
        submittedAt: sub.submittedAt.toISOString()
      }))
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Get user's orders with pagination
export async function getUserOrders(page = 1, limit = 10) {
  try {
    const user = await getAuthUser();

    if (!user?.id) {
      return { orders: [], totalPages: 0, currentPage: 1 };
    }

    const skip = (page - 1) * limit;
    
    const [orders, totalCount] = await Promise.all([
      Order.find({ userId: user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ userId: user.id })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      orders: orders.map(order => ({
        ...order.toObject(),
        id: order._id.toString(),
        createdAt: order.createdAt.toISOString(),
        items: order.items || []
      })),
      totalPages,
      currentPage: page,
      totalCount
    };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { orders: [], totalPages: 0, currentPage: 1 };
  }
}

// Get user's subscriptions
export async function getUserSubscriptions() {
  try {
    const user = await getAuthUser();

    if (!user?.id) {
      return [];
    }

    const subscriptions = await Subscription.find({ userId: user.id })
      .sort({ startedAt: -1 });

    return subscriptions.map(sub => ({
      ...sub.toObject(),
      id: sub._id.toString(),
      startedAt: sub.startedAt.toISOString(),
      expiresAt: sub.expiresAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    return [];
  }
}

// Update user subscription
export async function updateUserSubscription(subscriptionId, isActive) {
  try {
    const user = await getAuthUser();

    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    const result = await Subscription.updateOne(
      { 
        _id: subscriptionId,
        userId: user.id // Ensure user can only update their own subscriptions
      },
      { isActive }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Subscription not found or unauthorized' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return { success: false, error: 'Failed to update subscription' };
  }
}

// Get player profile by ID
export async function getPlayerProfile(playerId) {
  try {
    const player = await Player.findById(playerId);

    if (!player) {
      return null;
    }

    return {
      ...player.toObject(),
      id: player._id.toString(),
      createdAt: player.createdAt.toISOString(),
      updatedAt: player.updatedAt.toISOString(),
      stats: player.stats || null,
      clubHistory: player.clubHistory || null
    };
  } catch (error) {
    console.error('Error fetching player profile:', error);
    return null;
  }
}

// Get current user's player profile (if they are a player)
export async function getCurrentPlayerProfile() {
  try {
    const user = await getAuthUser();

    if (!user?.id) {
      return null;
    }

    if (user.role !== 'player') {
      return null;
    }

    // Find player record by email
    const player = await Player.findOne({ email: user.email });

    if (!player) {
      return null;
    }

    return {
      ...player.toObject(),
      id: player._id.toString(),
      createdAt: player.createdAt.toISOString(),
      updatedAt: player.updatedAt.toISOString(),
      stats: player.stats || null,
      clubHistory: player.clubHistory || null
    };
  } catch (error) {
    console.error('Error fetching current player profile:', error);
    return null;
  }
}

// Update player profile
export async function updatePlayerProfile(playerId, data) {
  try {
    const user = await getAuthUser();

    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    // Check if user is the owner of this player profile
    const player = await Player.findById(playerId);

    if (!player || player.email !== user.email) {
      return { success: false, error: 'Unauthorized to update this profile' };
    }

    // Prepare data for update
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    const result = await Player.updateOne(
      { _id: playerId },
      updateData
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Player profile not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating player profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

// Cancel order
export async function cancelOrder(orderId) {
  try {
    const user = await getAuthUser();

    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    // Check if order belongs to user and is still pending
    const order = await Order.findOne({
      _id: orderId,
      userId: user.id,
      status: 'pending'
    });

    if (!order) {
      return { success: false, error: 'Order not found or cannot be cancelled' };
    }

    const result = await Order.updateOne(
      { _id: orderId },
      { status: 'cancelled' }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Order not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error cancelling order:', error);
    return { success: false, error: 'Failed to cancel order' };
  }
}
