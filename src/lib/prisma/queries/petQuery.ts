import prisma from "../prisma";
import { NewPetData } from "../../types/types";

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

const create = (data: NewPetData) => {
  return prisma.pet.create({ data });
};

const petQuery = {
  list,
  findById,
  create,
};

export default petQuery;
