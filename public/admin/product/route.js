import prisma from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany();
  return Response.json(products);
}

export async function POST(req) {
  const body = await req.json();
  const newProduct = await prisma.product.create({ data: body });
  return Response.json(newProduct, { status: 201 });
}
