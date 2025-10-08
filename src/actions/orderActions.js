'use server';
import { PendingOrder } from "../lib/schemas";
import dbConnect from "@/lib/mongodb";

// 🧩 Helper to normalize MongoDB documents
const normalize = (doc) => ({
  ...doc,
  id: doc._id?.toString(),
  _id: undefined,
  createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
  updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
});

// 💾 Save or update a pending order
export const savePendingOrder = async (userId, items, type) => {
  await dbConnect();
  const existing = await PendingOrder.findOne({ userId });

  if (existing) {
    await PendingOrder.findByIdAndUpdate(existing._id, { items, type });
  } else {
    await PendingOrder.create({ userId, items, type });
  }
};

// 📦 Get pending order for a user
export const getPendingOrder = async (userId) => {
  await dbConnect();
  const order = await PendingOrder.findOne({ userId }).lean();

  if (!order) return null;

  return normalize(order);
};

// ❌ Delete pending order for a user
export const deletePendingOrder = async (userId) => {
  await dbConnect();
  const existing = await PendingOrder.findOne({ userId }).lean();

  if (existing) {
    await PendingOrder.findByIdAndDelete(existing._id);
  }
};
