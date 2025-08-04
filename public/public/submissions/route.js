import prisma from '@/lib/prisma';

export async function POST(req) {
  const body = await req.json();
  const created = await prisma.submission.create({ data: body });
  return Response.json(created, { status: 201 });
}