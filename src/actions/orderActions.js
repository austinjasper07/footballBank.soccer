'use server';
import { PendingOrder } from "../lib/schemas"
import dbConnect from "@/lib/mongodb";  

export const savePendingOrder = async (userId, items, type) => {
  await dbConnect();
  const existing = await PendingOrder.findOne({ userId })

  if (existing) {
    await PendingOrder.findByIdAndUpdate(existing._id, { items, type })
  } else {
    await PendingOrder.create({ userId, items, type })
  }
}

export const getPendingOrder = async (userId) => {
  await dbConnect();
  return PendingOrder.findOne({ userId })
}

export const deletePendingOrder = async (userId) => {
  await dbConnect();
  const existing = await PendingOrder.findOne({ userId })
  if (existing) {
    await PendingOrder.findByIdAndDelete(existing._id)
  }
}
