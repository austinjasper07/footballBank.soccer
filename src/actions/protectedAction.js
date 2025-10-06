'use server'

import { Submission, PaymentMethod } from "@/lib/schemas";

export async function createSubmission(data) {
  console.log("Creating submission with data:", data);
  return await Submission.create(data);
}

export async function getPaymentMethod(userId) {
  return await PaymentMethod.findOne({ userId });
}



// export async function getSubscriptionPlan() {
//   return await Subscription.find({});
// }