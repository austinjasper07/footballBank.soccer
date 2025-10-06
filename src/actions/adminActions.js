"use server";

import { User, Post, Player, Product, Order, Subscription, Message, Submission } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
// USERS
export const getAllUsers = async () => {
  await dbConnect();
  try {
    return await User.find({}).sort({ createdAt: -1 });
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
};

export const getUserById = async (id) => {
  await dbConnect();
  try {
    return await User.findById(id);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    return null;
  }
};

export async function createUser(data) {
  await dbConnect();
  try {
    const existingUser = await User.findOne({
      $or: [
        { email: data.email }
      ]
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    await User.create(data);
    
  } catch (err) {
    console.error("Error creating user:", err);
    return err;
  }
}

export async function updateUser(userId, data) {
  await dbConnect();
  try {
    // Remove id, createdAt, updatedAt from data before updating
    const { id, createdAt, updatedAt, ...updateData } = data;
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId }
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }
    }
    await User.findByIdAndUpdate(userId, updateData, { new: true });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    console.error("Error updating user:", err);
    return err;
  }
}

export async function deleteUser(id) {
  await dbConnect();
  try {
    await User.findByIdAndDelete(id);
    return await getAllUsers();
  } catch (err) {
    console.error("Error deleting user:", err);
    return err;
  }
}

// PRODUCTS
export async function getAllProducts() {
  await dbConnect();
  try {
    return await Product.find({}).sort({ createdAt: -1 });
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
}

export async function createProduct(data) {
  await dbConnect();
  try {
    await Product.create(data);
    return await getAllProducts();
  } catch (err) {
    console.error("Error creating product:", err);
    return err;
  }
}

export async function updateProduct(productId, data) {
  await dbConnect();
  try {
    // Remove id, createdAt, updatedAt from data before updating
    const { id, createdAt, updatedAt, ...updateData } = data;
    await Product.findByIdAndUpdate(productId, updateData);
    return await getAllProducts();
  } catch (err) {
    console.error("Error updating product:", err);
    return err;
  }
}

export async function deleteProduct(id) {
  await dbConnect();
  try {
    await Product.findByIdAndDelete(id);
    return await getAllProducts();
  } catch (err) {
    console.error("Error deleting product:", err);
    return err;
  }
}

// PLAYERS
export async function getAllPlayers() {
  await dbConnect();
  try {
    return await Player.find({}).sort({ createdAt: -1 });
  } catch (err) {
    console.error("Error fetching players:", err);
    return [];
  }
}

export async function createPlayer(data) {
  await dbConnect();
  try {
    // Check if player with same email already exists
    const existingPlayer = await Player.findOne({ email: data.email });

    if (existingPlayer) {
      throw new Error("Player with this email already exists");
    }
    // Create new player
    return await Player.create(data);
  } catch (err) {
    console.error("Error creating player:", err);
    return err;
  }
}

export async function updatePlayer(playerId, data) {
  await dbConnect();
  try {
    // Remove id from data before updating
    const { id, createdAt, updatedAt, ...updateData } = data;
    return await Player.findByIdAndUpdate(playerId, updateData, { new: true });
  } catch (err) {
    console.error("Error updating player:", err);
    return err;
  }
}

export async function deletePlayer(id) {
  await dbConnect();
  try {
    return await Player.findByIdAndDelete(id);
  } catch (err) {
    console.error("Error deleting player:", err);
    return err;
  }
}

// POSTS
export async function getAllPosts() {
  await dbConnect();
  try {
    return await Post.find({}).sort({ createdAt: -1 });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return [];
  }
}

export async function createPost(data) {
  await dbConnect();
  try {
    return await Post.create(data);
  } catch (err) {
    console.error("Error creating post:", err);
    return err;
  }
}

export async function updatePost(postId, data) {
  await dbConnect();
  try {
    // Remove id, createdAt, updatedAt from data before updating
    const { id, createdAt, updatedAt, ...updateData } = data;
    return await Post.findByIdAndUpdate(postId, updateData, { new: true });
  } catch (err) {
    console.error("Error updating post:", err);
    return err;
  }
}

export async function deletePost(id) {
  await dbConnect();
  try {
    return await Post.findByIdAndDelete(id);
  } catch (err) {
    console.error("Error deleting post:", err);
    return err;
  }
}

// SUBMISSIONS
export async function getAllSubmissions() {
  await dbConnect();
  try {
    return await Submission.find({}).sort({ submittedAt: -1 });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return [];
  }
}

export async function getSubmissionsById(id) {
  await dbConnect();
  try {
    return await Submission.findById(id);
  } catch (err) {
    console.error("Error fetching submission by ID:", err);
    return null;
  }
}

export async function approveSubmission(submissionId) {
  await dbConnect();
  try {
    const approvedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      { status: "APPROVED" },
      { new: true }
    );

    if (!approvedSubmission) {
      throw new Error("Submission not found");
    }

    // Create player from approved submission
    const {
      _id,
      submittedAt,
      status,
      rejectionReason,
      ...submissionData
    } = approvedSubmission.toObject();
    
    const player = await Player.create(submissionData);
    console.log(player);
    const players = await getAllPlayers();
    return players;
  } catch (err) {
    console.error("Error approving submission:", err);
    return err;
  }
}

export async function rejectSubmission(id, reason) {
  await dbConnect();
  try {
    return await Submission.findByIdAndUpdate(
      id,
      { status: "REJECTED", rejectionReason: reason },
      { new: true }
    );
  } catch (err) {
    console.error("Error rejecting submission:", err);
    return err;
  }
}

export async function deleteSubmission(id) {
  await dbConnect();
  try {
    return await Submission.findByIdAndDelete(id);
  } catch (err) {
    console.error("Error deleting submission:", err);
    return err;
  }
}

// ORDERS
export async function getAllOrders() {
  await dbConnect();
  try {
    return await Order.find({}).sort({ createdAt: -1 });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
}

// AFFILIATE PRODUCTS (using Product model)
export async function getAffiliateProducts() {
  await dbConnect();
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return products;
  } catch (err) {
    console.error("Error fetching affiliate products:", err);
    return [];
  }
}

export async function createAffiliateProduct(data) {
  await dbConnect();
  try {
    const product = await Product.create(data);
    return product;
  } catch (err) {
    console.error("Error creating affiliate product:", err);
    return err;
  }
}

export async function updateAffiliateProduct(id, data) {
  await dbConnect();
  try {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    return product;
  } catch (err) {
    console.error("Error updating affiliate product:", err);
    return err;
  }
}

export async function deleteAffiliateProduct(id) {
  await dbConnect();
  try {
    await Product.findByIdAndDelete(id);
    return await getAffiliateProducts();
  } catch (err) {
    console.error("Error deleting affiliate product:", err);
    return err;
  }
}