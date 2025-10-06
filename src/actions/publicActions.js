'use server'
import { Post, Player, Product } from '@/lib/schemas'

export async function getAllPosts() {
  const posts = await Post.find({}).sort({ createdAt: -1 })
  return posts.map(post => ({
    ...post.toObject(),
    id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }))
}

export async function getFeaturedPosts() {
  const posts = await Post.find({ featured: true }).sort({ createdAt: -1 })
  return posts.map(post => ({
    ...post.toObject(),
    id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }))
}

export async function getPostById(id) {
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
}

export async function getAllPlayers() {
  const players = await Player.find({}).sort({ createdAt: -1 })
  return players.map(player => ({
    ...player.toObject(),
    id: player._id.toString(),
    createdAt: player.createdAt.toISOString(),
    updatedAt: player.updatedAt.toISOString(),
  }))
}

export async function getFeaturedPlayers() {
  const players = await Player.find({ featured: true }).sort({ createdAt: -1 })
  return players.map(player => ({
    ...player.toObject(),
    id: player._id.toString(),
    createdAt: player.createdAt.toISOString(),
    updatedAt: player.updatedAt.toISOString(),
  }))
}

export async function getPlayerById(id) {
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
}

export async function getAllProducts() {
  const products = await Product.find({}).sort({ createdAt: -1 })
  return products.map(product => ({
    ...product.toObject(),
    id: product._id.toString(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }))
}

export async function getProductById(id) {
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
}
