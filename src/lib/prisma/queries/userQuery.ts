import { z } from "zod";
import prisma from "../prisma";
import {
  CreateUserSchema,
  UpdateUserSchema,
  UpgradeUserSchema,
} from "../../zod/User";
import { UserRole } from "@prisma/client";

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
    select: {
      id: true,
      username: true,
      pets: {
        include: {
          color: { select: { name: true } },
          species: { select: { name: true } },
        },
      },
    },
  });
};

const findByUsername = (username: string) => {
  return prisma.user.findUnique({ where: { username } });
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

const update = (id: number, data: z.infer<typeof UpdateUserSchema>) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      username: true,
    },
  });
};

const upgrade = (id: number, data: z.infer<typeof UpgradeUserSchema>) => {
  return prisma.user.update({
    where: { id },
    data: { role: data.accessTarget as UserRole },
    select: {
      id: true,
      role: true,
      username: true,
      email: true,
    },
  });
};

const userQuery = { list, findById, findByUsername, create, update, upgrade };

export default userQuery;
