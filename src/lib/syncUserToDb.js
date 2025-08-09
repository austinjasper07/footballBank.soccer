"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "./prisma";

/**
 * Synchronizes the authenticated Kinde user to the database.
 * If the user does not exist, creates a new user record.
 */
export const syncUserToDb = async () => {
  const { getUser, getRoles } = getKindeServerSession();
  const kindeUser = await getUser();
  const roles = await getRoles();
  const role = Array.isArray(roles) && roles.length > 0 ? roles[0] : "user";

  if (!kindeUser?.id) {
    return;
  }

  try {
    // Check if user already exists by email OR kindeId
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: kindeUser.email },
          { kindeId: kindeUser.id }
        ],
      },
    });

    if (existingUser) {
      return;
    }

    // Create new user with actual variable values
    const newUser = await prisma.user.create({
      data: {
        kindeId: kindeUser.id,
        email: kindeUser.email ?? "",
        firstName: kindeUser.given_name ?? "",
        lastName: kindeUser.family_name ?? "",
        password: "",
        role,
        subscribed: false,
      },
    });

    console.log("User created:", newUser.id);
    return newUser;
  } catch (err) {
    console.error("Error creating user:", err);
    return err;
  }
};
