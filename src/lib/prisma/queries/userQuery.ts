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

const userQuery = { list };

export default userQuery;
