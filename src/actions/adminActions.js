"use server";

import prisma from "@/lib/prisma";

// USERS
export const getAllUsers = async () => {
  try {
    return await prisma.user.findMany();
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
};

export const getUserById = async (id) => {
  try {
    return await prisma.user.findUnique({ where: { kindeId: id } });
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    return null;
  }
};

export async function createUser(data) {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { kindeId: data.kindeId }
        ]
      }
    });

    if (existingUser) {
      throw new Error("User with this email or Kinde ID already exists");
    }

    await prisma.user.create({ data });
    
  } catch (err) {
    console.error("Error creating user:", err);
    return err;
  }
}


export async function updateUser(userId, data) {
  try {
    // Remove id, createdAt, kindeId, updatedAt from data before updating
    const { id, createdAt, kindeId, updatedAt, ...updateData } = data;
    if (updateData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: updateData.email,
          id: { not: userId } // Ensure we're not checking the same user
        }
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }
    }
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    return await getAllUsers();
  } catch (err) {
    console.error("Error updating user:", err);
    return null;
  }
}

export async function deleteUser(id) {
  try {
    await prisma.user.delete({ where: { id } });

    return await getAllUsers();
  } catch (err) {
    console.error("Error deleting user:", err);
    return null;
  }
}

// PRODUCTS
export async function getAllProducts() {
  try {
    return await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
}
export async function createProduct(data) {
  try {
    await prisma.product.create({ data });

    return await getAllProducts();
  } catch (err) {
    console.error("Error creating product:", err);
    return null;
  }
}

export async function updateProduct(productId, data) {
  try {
    // Remove id, createdAt, updatedAt from data before updating
    const { id, createdAt, updatedAt, ...updateData } = data;
    await prisma.product.update({ where: { id: productId }, data: updateData });
    return await getAllProducts();
  } catch (err) {
    console.error("Error updating product:", err);
    return null;
  }
}

export async function deleteProduct(id) {
  try {
    await prisma.product.delete({ where: { id } });
    return await getAllProducts();
  } catch (err) {
    console.error("Error deleting product:", err);
    return null;
  }
}

// PLAYERS
export async function getAllPlayers() {
  try {
    return await prisma.player.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    console.error("Error fetching players:", err);
    return [];
  }
}

export async function createPlayer(data) {
  try {
    // Check if player with same email already exists
    const existingPlayer = await prisma.player.findFirst({
      where: { email: data.email }
    });

    if (existingPlayer) {
      throw new Error("Player with this email already exists");
    }
    // Create new player
    return await prisma.player.create({ data });
  } catch (err) {
    console.error("Error creating player:", err);
    return err;
  }
}



export async function updatePlayer(playerId, data) {
  try {
    // Remove id from data before updating
    const { id, createdAt, updatedAt, ...updateData } = data;
    return await prisma.player.update({
      where: { id: playerId },
      data: updateData,
    });
  } catch (err) {
    console.error("Error updating player:", err);
    return null;
  }
}

export async function deletePlayer(id) {
  try {
    return await prisma.player.delete({ where: { id } });
  } catch (err) {
    console.error("Error deleting player:", err);
    return null;
  }
}

// POSTS
export async function getAllPosts() {
  try {
    return await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return [];
  }
}

export async function createPost(data) {
  try {
    return await prisma.post.create({ data });
  } catch (err) {
    console.error("Error creating post:", err);
    return null;
  }
}

export async function updatePost(postId, data) {
  try {
    // Remove id, createdAt, updatedAt from data before updating
    const { id, createdAt, updatedAt, ...updateData } = data;
    return await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });
  } catch (err) {
    console.error("Error updating post:", err);
    return null;
  }
}

export async function deletePost(id) {
  try {
    return await prisma.post.delete({ where: { id } });
  } catch (err) {
    console.error("Error deleting post:", err);
    return null;
  }
}

// SUBMISSIONS
export async function getAllSubmissions() {
  try {
    return await prisma.submission.findMany({
      orderBy: { submittedAt: "desc" },
    });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return [];
  }
}

export async function getSubmissionsById(id) {
  try {
    return await prisma.submission.findUnique({ where: { id } });
  } catch (err) {
    console.error("Error fetching submission by ID:", err);
    return null;
  }
}

export async function approveSubmission(submissionId) {
  try {
    const approvedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: { status: "APPROVED" },
    });
    if (!approvedSubmission) {
      console.error("No submission found with ID:", submissionId);
      return null;
    }
    const {
      id,
      userId,
      submittedAt,
      status,
      rejectionReason,
      createdAt,
      updatedAt,
      ...submissionData
    } = approvedSubmission;
    const player = await prisma.player.create({ data: submissionData });
    console.log(player);
    const players = await getAllPlayers();
    return players;
  } catch (err) {
    console.error("Error approving submission:", err);
    return null;
  }
}

export async function rejectSubmission(id, reason) {
  try {
    return await prisma.submission.update({
      where: { id },
      data: { status: "REJECTED", rejectionReason: reason },
    });
  } catch (err) {
    console.error("Error rejecting submission:", err);
    return null;
  }
}

// ORDERS
export async function getAllOrders() {
  try {
    return await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
}
