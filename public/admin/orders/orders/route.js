import prisma from '@/lib/prisma';

export async function GET() {
  const orders = await prisma.order.findMany();
  return Response.json(orders);
}