'use server';
import { prisma } from "./prisma"

export const savePendingOrder = async (userId, items, type) => {
  const existing = await prisma.pendingOrder.findFirst({ where: { userId } })

  if (existing) {
    await prisma.pendingOrder.update({
      where: { id: existing.id },
      data: { items, type }
    })
  } else {
    await prisma.pendingOrder.create({
      data: { userId, items, type }
    })
  }
}

export const getPendingOrder = async (userId) => {
  return prisma.pendingOrder.findFirst({ where: { userId } })
}

export const deletePendingOrder = async (userId) => {
  const existing = await prisma.pendingOrder.findFirst({ where: { userId } })
  if (existing) {
    await prisma.pendingOrder.delete({ where: { id: existing.id } })
  }
}
