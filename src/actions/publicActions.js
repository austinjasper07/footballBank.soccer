'use server'
import dbConnect from '@/lib/mongodb'
import { Post, Player, Product } from '@/lib/schemas'


export async function getAllPosts() {
  await dbConnect();
  try {
    
    const posts = await Post.find({}).sort({ createdAt: -1 })
    return posts.map(post => ({
      ...post.toObject(),
      id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching posts:", error);
    return []
  }
}

export async function getFeaturedPosts() {
  await dbConnect();
  try {
    const posts = await Post.find({ featured: true }).sort({ createdAt: -1 })
    return posts.map(post => ({
      ...post.toObject(),
      id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return []
  }
}

export async function getPostById(id) {
  await dbConnect();
  try {
    const post = await Post.findById(id)
    if (post) {
      return {
        ...post.toObject(),
        id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching post:", error);
    return null
  }
}

export async function getAllPlayers() {
  await dbConnect();
  try {
    const players = await Player.find({}).sort({ createdAt: -1 })
    return players.map(player => ({
      ...player.toObject(),
      id: player._id.toString(),
      createdAt: player.createdAt.toISOString(),
      updatedAt: player.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching players:", error);
    return []
  }
}

export async function getFeaturedPlayers() {
  await dbConnect();
  try {
    const players = await Player.find({ featured: true }).sort({ createdAt: -1 })
    return players.map(player => ({
      ...player.toObject(),
      id: player._id.toString(),
      createdAt: player.createdAt.toISOString(),
      updatedAt: player.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching featured players:", error);
    return []
  }
}

export async function getPlayerById(id) {
  await dbConnect();
  try {
    const player = await Player.findById(id)
    if (player) {
      return {
        ...player.toObject(),
        id: player._id.toString(),
        createdAt: player.createdAt.toISOString(),
        updatedAt: player.updatedAt.toISOString(),
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching player:", error);
    return null
  }
}

export async function getAllProducts() {
  await dbConnect();
  try {
    const products = await Product.find({}).sort({ createdAt: -1 })
    return products.map(product => ({
      ...product.toObject(),
      id: product._id.toString(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching products:", error);
    return []
  }
}

export async function getProductById(id) {
  await dbConnect();
  try {
    const product = await Product.findById(id)
    if (product) {
      return {
        ...product.toObject(),
        id: product._id.toString(),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching product:", error);
    return null
  }
}
