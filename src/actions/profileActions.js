"use server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/oauth";

// Get current user's profile data
export async function getCurrentUserProfile() {
  try {
    const user = await getAuthUser();

    if (!user?.id) {
      return null;
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        orders: {
          include: {
            items: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        subscriptions: {
          orderBy: {
            startedAt: 'desc'
          }
        },
        paymentMethods: true,
        Submission: {
          orderBy: {
            submittedAt: 'desc'
          }
        }
      }
    });

    return userProfile;
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
      prisma.order.findMany({
        where: { userId: user.id },
        include: {
          items: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.order.count({
        where: { userId: user.id }
      })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      orders,
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

    if (!user) {
      return [];
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      orderBy: {
        startedAt: 'desc'
      }
    });

    return subscriptions;
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

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    await prisma.subscription.update({
      where: { 
        id: subscriptionId,
        userId: user.id // Ensure user can only update their own subscriptions
      },
      data: { isActive }
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return { success: false, error: 'Failed to update subscription' };
  }
}

// Get player profile by ID
export async function getPlayerProfile(playerId) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: playerId }
    });

    if (!player) {
      return null;
    }

    // Parse JSON fields
    const stats = player.stats ? JSON.parse(player.stats) : null;
    const clubHistory = player.clubHistory ? JSON.parse(player.clubHistory) : null;

    return {
      ...player,
      stats,
      clubHistory
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
    const player = await prisma.player.findUnique({
      where: { email: user.email }
    });

    if (!player) {
      return null;
    }

    // Parse JSON fields
    const stats = player.stats ? JSON.parse(player.stats) : null;
    const clubHistory = player.clubHistory ? JSON.parse(player.clubHistory) : null;

    return {
      ...player,
      stats,
      clubHistory
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

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if user is the owner of this player profile
    const player = await prisma.player.findUnique({
      where: { id: playerId }
    });

    if (!player || player.email !== user.email) {
      return { success: false, error: 'Unauthorized to update this profile' };
    }

    // Prepare data for update
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    // Handle JSON fields
    if (data.stats) {
      updateData.stats = JSON.stringify(data.stats);
    }
    if (data.clubHistory) {
      updateData.clubHistory = JSON.stringify(data.clubHistory);
    }

    await prisma.player.update({
      where: { id: playerId },
      data: updateData
    });

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

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if order belongs to user and is still pending
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
        status: 'pending'
      }
    });

    if (!order) {
      return { success: false, error: 'Order not found or cannot be cancelled' };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' }
    });

    return { success: true };
  } catch (error) {
    console.error('Error cancelling order:', error);
    return { success: false, error: 'Failed to cancel order' };
  }
}
