import prisma from '@/lib/prisma';

export async function GET(_, { params }) {
  const post = await prisma.post.findUnique({ where: { id: Number(params.id) } });
  return Response.json(post);
}

export async function PUT(req, { params }) {
  const data = await req.json();
  const updated = await prisma.post.update({
    where: { id: Number(params.id) },
    data,
  });
  return Response.json(updated);
}

export async function DELETE(_, { params }) {
  await prisma.post.delete({ where: { id: Number(params.id) } });
  return new Response(null, { status: 204 });
}
