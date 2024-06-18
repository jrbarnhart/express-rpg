import prisma from "../prisma";
import { NewPetData } from "../../types/types";
import { z } from "zod";
import { UpdatePetSchema } from "../../zod/Pet";

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

const update = (id: number, data: z.infer<typeof UpdatePetSchema>) => {
  return prisma.pet.update({
    where: { id },
    data,
  });
};

const petQuery = {
  list,
  findById,
  create,
  update,
};

export default petQuery;
