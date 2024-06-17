import { z } from "zod";
import prisma from "../prisma";
import { CreateUserSchema } from "../../zod/User";

const list = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      role: true,
      email: true,
      username: true,
      createdAt: true,
      updatedAt: true,
      pets: true,
    },
  });
};

const findById = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, pets: true },
  });
};

const create = (
  data: z.infer<typeof CreateUserSchema>,
  hashedPassword: string
) => {
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
    },
  });
};

const userQuery = { list, findById, create };

export default userQuery;
