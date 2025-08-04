import prisma from '@/lib/prisma';

export async function GET(_, { params }) {
  const player = await prisma.player.findUnique({ where: { id: Number(params.id) } });
  return Response.json(player);
}

export async function PUT(req, { params }) {
  const data = await req.json();
  const updated = await prisma.player.update({
    where: { id: Number(params.id) },
    data,
  });
  return Response.json(updated);
}

export async function DELETE(_, { params }) {
  await prisma.player.delete({ where: { id: Number(params.id) } });
  return new Response(null, { status: 204 });
}
