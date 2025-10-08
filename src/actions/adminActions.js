"use server";

import { User, Post, Player, Product, Order, Subscription, Message, Submission } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";

// 🔧 Helper: safely convert any Mongoose doc(s) to plain JSON
const toPlain = (data) => JSON.parse(JSON.stringify(data));

// USERS
export const getAllUsers = async () => {
  await dbConnect();
  try {
    const users = await User.find({}).lean().sort({ createdAt: -1 });
    return toPlain(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
};

export const getUserById = async (id) => {
  await dbConnect();
  try {
    const user = await User.findById(id).lean();
    return toPlain(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    return null;
  }
};

export async function createUser(data) {
  await dbConnect();
  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) throw new Error("User with this email already exists");

    const createdUser = await User.create(data);
    return toPlain(createdUser);
  } catch (err) {
    console.error("Error creating user:", err);
    return err;
  }
}

export async function updateUser(userId, data) {
  await dbConnect();
  try {
    const { id, createdAt, updatedAt, ...updateData } = data;

    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId },
      });
      if (existingUser) throw new Error("User with this email already exists");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    revalidatePath("/admin/users");
    return toPlain(updatedUser);
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
    const products = await Product.find({}).lean().sort({ createdAt: -1 });
    return toPlain(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
}

export async function createProduct(data) {
  await dbConnect();
  try {
    const product = await Product.create(data);
    return toPlain(product);
  } catch (err) {
    console.error("Error creating product:", err);
    return err;
  }
}

export async function updateProduct(productId, data) {
  await dbConnect();
  try {
    const { id, createdAt, updatedAt, ...updateData } = data;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    return toPlain(updatedProduct);
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
    const players = await Player.find({}).lean().sort({ createdAt: -1 });
    return toPlain(players);
  } catch (err) {
    console.error("Error fetching players:", err);
    return [];
  }
}

export async function createPlayer(data) {
  await dbConnect();
  try {
    const existingPlayer = await Player.findOne({ email: data.email });
    if (existingPlayer) throw new Error("Player with this email already exists");

    const player = await Player.create(data);
    return toPlain(player);
  } catch (err) {
    console.error("Error creating player:", err);
    return err;
  }
}

export async function updatePlayer(playerId, data) {
  await dbConnect();
  try {
    const { id, createdAt, updatedAt, ...updateData } = data;
    const updatedPlayer = await Player.findByIdAndUpdate(playerId, updateData, { new: true });
    return toPlain(updatedPlayer);
  } catch (err) {
    console.error("Error updating player:", err);
    return err;
  }
}

export async function deletePlayer(id) {
  await dbConnect();
  try {
    const deletedPlayer = await Player.findByIdAndDelete(id);
    return toPlain(deletedPlayer);
  } catch (err) {
    console.error("Error deleting player:", err);
    return err;
  }
}

// POSTS
export async function getAllPosts() {
  await dbConnect();
  try {
    const posts = await Post.find({}).lean().sort({ createdAt: -1 });
    return toPlain(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    return [];
  }
}

export async function createPost(data) {
  await dbConnect();
  try {
    const post = await Post.create(data);
    return toPlain(post);
  } catch (err) {
    console.error("Error creating post:", err);
    return err;
  }
}

export async function updatePost(postId, data) {
  await dbConnect();
  try {
    const { id, createdAt, updatedAt, ...updateData } = data;
    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });
    return toPlain(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    return err;
  }
}

export async function deletePost(id) {
  await dbConnect();
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    return toPlain(deletedPost);
  } catch (err) {
    console.error("Error deleting post:", err);
    return err;
  }
}

// SUBMISSIONS
export async function getAllSubmissions() {
  await dbConnect();
  try {
    const submissions = await Submission.find({}).lean().sort({ submittedAt: -1 });
    return toPlain(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return [];
  }
}

export async function getSubmissionsById(id) {
  await dbConnect();
  try {
    const submission = await Submission.findById(id).lean();
    return toPlain(submission);
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

    if (!approvedSubmission) throw new Error("Submission not found");

    const {
      _id,
      submittedAt,
      status,
      rejectionReason,
      ...submissionData
    } = approvedSubmission.toObject();

    const player = await Player.create(submissionData);
    return toPlain(await getAllPlayers());
  } catch (err) {
    console.error("Error approving submission:", err);
    return err;
  }
}

export async function rejectSubmission(id, reason) {
  await dbConnect();
  try {
    const rejected = await Submission.findByIdAndUpdate(
      id,
      { status: "REJECTED", rejectionReason: reason },
      { new: true }
    );
    return toPlain(rejected);
  } catch (err) {
    console.error("Error rejecting submission:", err);
    return err;
  }
}

export async function deleteSubmission(id) {
  await dbConnect();
  try {
    const deleted = await Submission.findByIdAndDelete(id);
    return toPlain(deleted);
  } catch (err) {
    console.error("Error deleting submission:", err);
    return err;
  }
}

// ORDERS
export async function getAllOrders() {
  await dbConnect();
  try {
    const orders = await Order.find({}).lean().sort({ createdAt: -1 });
    return toPlain(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
}

// AFFILIATE PRODUCTS
export async function getAffiliateProducts() {
  await dbConnect();
  try {
    const products = await AffiliateProduct.find({}).lean().sort({ createdAt: -1 });
    return toPlain(products);
  } catch (err) {
    console.error("Error fetching affiliate products:", err);
    return [];
  }
}

export async function createAffiliateProduct(data) {
  await dbConnect();
  try {
    const product = await AffiliateProduct.create(data);
    return toPlain(product);
  } catch (err) {
    console.error("Error creating affiliate product:", err);
    return err;
  }
}

export async function updateAffiliateProduct(id, data) {
  await dbConnect();
  try {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    return toPlain(product);
  } catch (err) {
    console.error("Error updating affiliate product:", err);
    return err;
  }
}

export async function deleteAffiliateProduct(id) {
  await dbConnect();
  try {
    await AffiliateProduct.findByIdAndDelete(id);
    return await getAffiliateProducts();
  } catch (err) {
    console.error("Error deleting affiliate product:", err);
    return err;
  }
}
