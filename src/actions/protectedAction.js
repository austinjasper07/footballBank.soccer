'use server'

import { Submission, PaymentMethod } from "@/lib/schemas";
import dbConnect from "@/lib/mongodb";

export async function createSubmission(data) {
  await dbConnect();
  console.log("Creating submission with data:", data);
  return await Submission.create(data);
}

export async function getPaymentMethod(userId) {
  await dbConnect();
  return await PaymentMethod.findOne({ userId });
}



// export async function getSubscriptionPlan() {
//   return await Subscription.find({});
// }