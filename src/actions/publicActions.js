'use server'
import  prisma  from '@/lib/prisma'

export async function getAllPosts() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } })
  return posts
}

export async function getFeaturedPosts() {
  const posts = await prisma.post.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
  })
  return posts
}

export async function getPostById(id) {
  const post = await prisma.post.findUnique({ where: { id } })
  return post
}

export async function getAllPlayers() {
  const players = await prisma.player.findMany({ orderBy: { createdAt: 'desc' } })
  return players
}

export async function getFeaturedPlayers() {
  const players = await prisma.player.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
  })
  return players
}

export async function getPlayerById(id) {
  return await prisma.player.findUnique({ where: { id } })
}

export async function getAllProducts() {
  return await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function getProductById(id) {
  return await prisma.product.findUnique({ where: { id } })
}
