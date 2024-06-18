import prisma from "../prisma";

const list = () => {
  return prisma.pet.findMany({
    take: 10,
    include: {
      color: { select: { name: true } },
      species: { select: { name: true } },
    },
  });
};

const findById = (id: number) => {
  return prisma.pet.findUnique({
    where: { id },
    include: {
      color: { select: { name: true } },
      species: { select: { name: true } },
    },
  });
};

const petQuery = {
  list,
  findById,
};

export default petQuery;
