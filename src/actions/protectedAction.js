"use server";

import { Submission, PaymentMethod } from "@/lib/schemas";
import dbConnect from "@/lib/mongodb";
import { notifyAdmins } from "@/lib/adminNotifications";

// Helper: recursively convert Mongoose values, including nested ObjectIds, to plain JSON values.
const normalize = (doc) => {
  if (!doc) return null;

  const plain = JSON.parse(JSON.stringify(doc));
  const { _id, ...rest } = plain;

  return {
    ...rest,
    id: _id ? String(_id) : undefined,
    createdAt: plain.createdAt ? new Date(plain.createdAt).toISOString() : null,
    updatedAt: plain.updatedAt ? new Date(plain.updatedAt).toISOString() : null,
  };
};

// 📨 Create Submission
export async function createSubmission(data) {
  await dbConnect();
  try {
    // console.log("Creating submission with data:", data);
    const submission = await Submission.create(data);
    try {
      await notifyAdmins({
        subject: `New player profile submission: ${data.firstName} ${data.lastName}`,
        title: "New player profile submission",
        message: `${data.firstName} ${data.lastName} submitted a player profile for review. Position: ${data.position || "Not provided"}.`,
        link: "/en/admin",
      });
    } catch (notificationError) {
      console.error("Admin submission notification failed:", notificationError);
    }
    return normalize(submission.toObject()); // ✅ plain JSON-safe object
  } catch (error) {
    console.error("Error creating submission:", error);
    throw error;
  }
}

// 💳 Get Payment Method by User ID
export async function getPaymentMethod(userId) {
  await dbConnect();
  try {
    const method = await PaymentMethod.findOne({ userId }).lean();
    return method ? normalize(method) : null; // ✅ lean = plain object
  } catch (error) {
    console.error("Error fetching payment method:", error);
    return null;
  }
}

// // Example (future): Get all subscription plans
// export async function getSubscriptionPlan() {
//   await dbConnect();
//   const plans = await Subscription.find({}).lean();
//   return plans.map(normalize);
// }
