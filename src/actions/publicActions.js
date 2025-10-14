"use server";

import dbConnect from "@/lib/mongodb";
import { Post, Player, Product } from "@/lib/schemas";

// 🔧 Helper: normalize MongoDB docs to plain serializable objects
const normalize = (doc) => ({
  ...doc,
  id: doc._id?.toString(),
  _id: undefined,
  createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
  updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
});

// POSTS
export async function getAllPosts() {
  await dbConnect();
  try {
    const posts = await Post.find({}).lean().sort({ createdAt: -1 });
    return posts.map(normalize);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getFeaturedPosts() {
  await dbConnect();
  try {
    const posts = await Post.find({ featured: true }).lean().sort({ createdAt: -1 });
    return posts.map(normalize);
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export async function getPostById(id) {
  await dbConnect();
  try {
    const post = await Post.findById(id).lean();
    return post ? normalize(post) : null;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null;
  }
}

// PLAYERS
export async function getAllPlayers() {
  await dbConnect();
  try {
    const players = await Player.find({}).lean().sort({ createdAt: -1 });
    return players.map(normalize);
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
}

export async function getFeaturedPlayers() {
  await dbConnect();
  try {
    const players = await Player.find({ featured: true }).lean().sort({ createdAt: -1 });
    return players.map(normalize);
  } catch (error) {
    console.error("Error fetching featured players:", error);
    return [];
  }
}

export async function getPlayerById(id) {
  await dbConnect();
  try {
    const player = await Player.findById(id).lean();
    return player ? normalize(player) : null;
  } catch (error) {
    console.error("Error fetching player by ID:", error);
    return null;
  }
}

// PRODUCTS
export async function getAllProducts() {
  await dbConnect();
  try {
    const products = await Product.find({}).lean().sort({ createdAt: -1 });
    return products.map(normalize);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id) {
  await dbConnect();
  try {
    const product = await Product.findById(id).lean();
    return product ? normalize(product) : null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}
