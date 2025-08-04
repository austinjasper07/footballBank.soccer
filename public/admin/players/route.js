import prisma from '@/lib/prisma';

export async function GET() {
  const players = await prisma.player.findMany();
  return Response.json(players);
}

export async function POST(req) {
  const body = await req.json();
  const newPlayer = await prisma.player.create({ data: body });
  return Response.json(newPlayer, { status: 201 });
}
