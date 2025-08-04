import prisma from '@/lib/prisma';

export async function GET() {
  const posts = await prisma.post.findMany();
  return Response.json(posts);
}

export async function POST(req) {
  const body = await req.json();
  const newPost = await prisma.post.create({ data: body });
  return Response.json(newPost, { status: 201 });
}
