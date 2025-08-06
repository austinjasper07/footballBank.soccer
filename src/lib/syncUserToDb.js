'use server';

// lib/syncUserToDb.ts
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import  prisma  from './prisma';

/**
 * Synchronizes the authenticated Kinde user to the database.
 * If the user does not exist, creates a new user record.
 * No parameters.
 * Returns a Promise that resolves when the operation is complete.
 */
export const syncUserToDb = async () => {
  const { getUser, getRoles } = getKindeServerSession();
  const kindeUser = await getUser();
  const roles = await getRoles();
  const role = Array.isArray(roles) && roles.length > 0 ? roles[0] : "user";

  if (!kindeUser?.id) {
    console.error('Kinde user not found or missing ID');
    return;
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { kindeId: kindeUser.id },
    });

    if (!existing) {
      const user = await prisma.user.create({
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
      console.log('User created:', { id: user.id, email: user.email });
    }
  } catch (err) {
    console.error('User sync failed', err);
  }
};
