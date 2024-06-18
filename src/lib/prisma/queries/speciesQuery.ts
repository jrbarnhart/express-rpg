import prisma from "../prisma";

const list = () => {
  return prisma.species.findMany({
    include: { colors: { select: { id: true, name: true } } },
  });
};

const findById = (id: number) => {
  return prisma.species.findUnique({
    where: { id },
    include: { colors: { select: { id: true, name: true } } },
  });
};

const speciesQuery = {
  list,
  findById,
};

export default speciesQuery;
