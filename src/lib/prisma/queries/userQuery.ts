import prisma from "../prisma";

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

const userQuery = { list, findById };

export default userQuery;
