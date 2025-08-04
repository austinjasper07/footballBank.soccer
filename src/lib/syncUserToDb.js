'use server';

// lib/syncUserToDb.ts
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import  prisma  from './prisma';

export const syncUserToDb = async () => {
  const { getUser, getRoles } = getKindeServerSession();
  const kindeUser = await getUser();
  const role = await getRoles() || "user";

  if (!kindeUser?.id) {
    console.error('Kinde user not found or missing ID');
    return;
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { kindeId: kindeUser.id },
    });

    if (!existing) {
      await prisma.user.create({
        data: {
          kindeId: kindeUser.id,
          email: kindeUser.email ?? '',
          firstName: kindeUser.given_name ?? '',
          lastName: kindeUser.family_name ?? '',
          password: '',
          role: role,
          subscribed: false,
        },
      });
    }
  } catch (err) {
    console.error('User sync failed', err);
  }
};
