import prisma from "../prisma";

const findById = (id: number) => {
  return prisma.species.findUnique({
    where: { id },
    include: { colors: { select: { id: true, name: true } } },
  });
};

const speciesQuery = {
  findById,
};

export default speciesQuery;
