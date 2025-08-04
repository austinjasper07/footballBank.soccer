import prisma from '@/lib/prisma';

export async function GET() {
  const submissions = await prisma.submission.findMany();
  return Response.json(submissions);
}