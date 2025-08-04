'use server'

import  prisma  from "@/lib/prisma";

export async function createSubmission(data) {
  console.log("Creating submission with data:", data);
  return await prisma.submission.create({ data });
}

export async function getPaymentMethod(userId) {
  return await prisma.paymentMethod.findFirst({ where: { userId } });
  
}



// export async function getSubscriptionPlan() {
//   return await prisma.subscriptionPlan.findMany();
// }