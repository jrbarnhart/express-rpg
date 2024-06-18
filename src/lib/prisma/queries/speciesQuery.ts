import { z } from "zod";
import prisma from "../prisma";
import { CreateSpeciesSchema, UpdateSpeciesSchema } from "../../zod/Species";

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

const create = (data: z.infer<typeof CreateSpeciesSchema>) => {
  return prisma.species.create({
    data: {
      name: data.name,
      colors: { connect: data.colorIds.map((id) => ({ id })) },
      baseHealth: data.baseHealth,
      baseMood: data.baseMood,
    },
  });
};

const update = (id: number, data: z.infer<typeof UpdateSpeciesSchema>) => {
  return prisma.species.update({
    where: { id },
    data: { ...data },
    include: { colors: { select: { id: true, name: true } } },
  });
};

const speciesQuery = {
  list,
  findById,
  create,
  update,
};

export default speciesQuery;
