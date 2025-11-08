"use server";

import { User, Post, Player, Product, Order, Subscription, Message, Submission, AffiliateProduct, Agent } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

// 🔧 Helper: safely convert any Mongoose doc(s) to plain JSON and convert _id to id
const toPlain = (data) => {
  const json = JSON.parse(JSON.stringify(data));
  
  // Handle arrays
  if (Array.isArray(json)) {
    return json.map(item => {
      if (item._id) {
        const { _id, ...rest } = item;
        return { id: _id, ...rest };
      }
      return item;
    });
  }
  
  // Handle single objects
  if (json && json._id) {
    const { _id, ...rest } = json;
    return { id: _id, ...rest };
  }
  
  return json;
};

// USERS
export const getAllUsers = async () => {
  await dbConnect();
  try {
    const users = await User.find({}).lean().sort({ createdAt: -1 });
    console.log("Raw users from DB:", users.slice(0, 1)); // Log first user to see structure
    const convertedUsers = toPlain(users);
    console.log("Converted users:", convertedUsers.slice(0, 1)); // Log first user after conversion
    return convertedUsers;
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
    console.log("Delete user - ID received:", id, "Type:", typeof id);
    
    // Convert string ID to ObjectId if needed
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(id);
    } catch (error) {
      console.error("Invalid ObjectId:", id);
      throw new Error("Invalid user ID");
    }
    
    console.log("Converted ObjectId:", objectId);
    
    // First, let's check if the user exists
    const userExists = await User.findById(objectId);
    console.log("User exists check:", userExists);
    
    const result = await User.findByIdAndDelete(objectId);
    console.log("Delete result:", result);
    
    if (!result) {
      throw new Error("User not found");
    }
    
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
}

// ORDERS
export async function getAllOrders() {
  await dbConnect();
  try {
    const orders = await Order.find({})
      .populate('userId', 'firstName lastName email')
      .lean()
      .sort({ createdAt: -1 });
    return toPlain(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
}

export async function getOrderById(id) {
  await dbConnect();
  try {
    const order = await Order.findById(id)
      .populate('userId', 'firstName lastName email')
      .lean();
    return toPlain(order);
  } catch (err) {
    console.error("Error fetching order by ID:", err);
    return null;
  }
}

export async function updateOrderStatus(id, status) {
  await dbConnect();
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    ).populate('userId', 'firstName lastName email');
    
    revalidatePath("/admin/orders");
    return toPlain(updatedOrder);
  } catch (err) {
    console.error("Error updating order status:", err);
    return err;
  }
}

export async function getOrderStats() {
  await dbConnect();
  try {
    const total = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: 'pending' });
    const fulfilled = await Order.countDocuments({ status: 'fulfilled' });
    const completed = await Order.countDocuments({ status: 'completed' });
    const cancelled = await Order.countDocuments({ status: 'cancelled' });
    
    // Payment status stats
    const paymentCompleted = await Order.countDocuments({ paymentStatus: 'completed' });
    const paymentFailed = await Order.countDocuments({ paymentStatus: 'failed' });
    const paymentPending = await Order.countDocuments({ paymentStatus: 'pending' });
    const paymentRefunded = await Order.countDocuments({ paymentStatus: 'refunded' });
    
    return {
      total,
      pending,
      fulfilled,
      completed,
      cancelled,
      paymentCompleted,
      paymentFailed,
      paymentPending,
      paymentRefunded
    };
  } catch (err) {
    console.error("Error fetching order stats:", err);
    return { 
      total: 0, pending: 0, fulfilled: 0, completed: 0, cancelled: 0,
      paymentCompleted: 0, paymentFailed: 0, paymentPending: 0, paymentRefunded: 0
    };
  }
}

// SUBSCRIPTIONS
export async function getAllSubscriptions() {
  await dbConnect();
  try {
    const subscriptions = await Subscription.find({})
      .populate('userId', 'firstName lastName email')
      .lean()
      .sort({ createdAt: -1 });
    return toPlain(subscriptions);
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
    return [];
  }
}

export async function getSubscriptionById(id) {
  await dbConnect();
  try {
    const subscription = await Subscription.findById(id)
      .populate('userId', 'firstName lastName email')
      .lean();
    return toPlain(subscription);
  } catch (err) {
    console.error("Error fetching subscription by ID:", err);
    return null;
  }
}

export async function updateSubscription(id, data) {
  await dbConnect();
  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(id, data, { new: true })
      .populate('userId', 'firstName lastName email');
    revalidatePath("/admin/subscriptions");
    return toPlain(updatedSubscription);
  } catch (err) {
    console.error("Error updating subscription:", err);
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
    revalidatePath("/admin/shop");
    return { success: true };
  } catch (err) {
    console.error("Error deleting product:", err);
    throw err;
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
    await Player.findByIdAndDelete(id);
    revalidatePath("/admin/players");
    return { success: true };
  } catch (err) {
    console.error("Error deleting player:", err);
    throw err;
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
    await Post.findByIdAndDelete(id);
    revalidatePath("/admin/blog");
    revalidatePath("/editor/posts");
    return { success: true };
  } catch (err) {
    console.error("Error deleting post:", err);
    throw err;
  }
}

// SUBMISSIONS
export async function getAllSubmissions() {
  await dbConnect();
  try {
    const submissions = await Submission.find({}).lean().sort({ submittedAt: -1 });
    // Ensure all submissions have a status (default to PENDING for existing submissions without status)
    const submissionsWithStatus = submissions.map(sub => ({
      ...sub,
      status: sub.status || 'PENDING'
    }));
    return toPlain(submissionsWithStatus);
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
      userId,
      ...submissionData
    } = approvedSubmission.toObject();

    // Create player from approved submission
    const player = await Player.create(submissionData);
    
    revalidatePath("/admin/submissions");
    return toPlain(approvedSubmission);
  } catch (err) {
    console.error("Error approving submission:", err);
    throw err;
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
    revalidatePath("/admin/submissions");
    return toPlain(rejected);
  } catch (err) {
    console.error("Error rejecting submission:", err);
    throw err;
  }
}

export async function deleteSubmission(id) {
  await dbConnect();
  try {
    const deleted = await Submission.findByIdAndDelete(id);
    revalidatePath("/admin/submissions");
    return toPlain(deleted);
  } catch (err) {
    console.error("Error deleting submission:", err);
    throw err;
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

// Agent Management Functions
export async function getAgentInfo() {
  await dbConnect();
  try {
    let agent = await Agent.findOne();
    if (!agent) {
      // Create default agent if none exists
      agent = await Agent.create({
        name: "Ayodeji Fatade",
        title: "United States Based Agent",
        profilePhoto: "/FootballBank_agent.jpg",
        bio: "Experienced football agent with a proven track record of helping players achieve their professional goals.",
        credentials: "Licenced Agent",
        location: "United States"
      });
    }
    return toPlain(agent);
  } catch (err) {
    console.error("Error getting agent info:", err);
    return err;
  }
}

export async function updateAgentInfo(formData) {
  await dbConnect();
  try {
    const { name, bio, credentials, location, profilePhoto } = Object.fromEntries(formData);
    
    let agent = await Agent.findOne();
    if (!agent) {
      agent = await Agent.create({
        name: name || "Ayodeji Fatade",
        profilePhoto: profilePhoto || "/FootballBank_agent.jpg",
        bio: bio || "Experienced football agent with a proven track record of helping players achieve their professional goals.",
        credentials: credentials || "Licenced Agent",
        location: location || "United States"
      });
    } else {
      agent.name = name || agent.name;
      agent.bio = bio || agent.bio;
      agent.credentials = credentials || agent.credentials;
      agent.location = location || agent.location;
      if (profilePhoto) {
        agent.profilePhoto = profilePhoto;
      }
      agent.updatedAt = new Date();
      await agent.save();
    }
    
    revalidatePath('/agent');
    return toPlain(agent);
  } catch (err) {
    console.error("Error updating agent info:", err);
    return err;
  }
}
