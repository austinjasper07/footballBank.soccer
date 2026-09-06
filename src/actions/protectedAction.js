"use server";

import { Submission, PaymentMethod, Player } from "@/lib/schemas";
import dbConnect from "@/lib/mongodb";
import { notifyAdmins } from "@/lib/adminNotifications";
import { requireAuth } from "@/lib/oauth";

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
  const authUser = await requireAuth();
  await dbConnect();
  try {
    const normalizedEmail = data.email?.trim().toLowerCase();
    if (!normalizedEmail || normalizedEmail !== authUser.email.toLowerCase()) {
      throw new Error("The player profile email must match the registered account email.");
    }

    const [existingPlayer, pendingSubmission] = await Promise.all([
      Player.findOne({ email: normalizedEmail }).select("_id").lean(),
      Submission.findOne({ email: normalizedEmail, status: "PENDING" }).select("_id").lean(),
    ]);
    if (existingPlayer) {
      throw new Error("A player profile already exists for this email.");
    }
    if (pendingSubmission) {
      throw new Error("A player profile submission is already under review for this email.");
    }

    // console.log("Creating submission with data:", data);
    const submission = await Submission.create({
      ...data,
      email: normalizedEmail,
      userId: authUser.id,
      salaryExpectation: undefined,
    });
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
