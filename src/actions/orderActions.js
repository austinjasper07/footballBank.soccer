'use server';
import { PendingOrder } from "../lib/schemas"

export const savePendingOrder = async (userId, items, type) => {
  const existing = await PendingOrder.findOne({ userId })

  if (existing) {
    await PendingOrder.findByIdAndUpdate(existing._id, { items, type })
  } else {
    await PendingOrder.create({ userId, items, type })
  }
}

export const getPendingOrder = async (userId) => {
  return PendingOrder.findOne({ userId })
}

export const deletePendingOrder = async (userId) => {
  const existing = await PendingOrder.findOne({ userId })
  if (existing) {
    await PendingOrder.findByIdAndDelete(existing._id)
  }
}
