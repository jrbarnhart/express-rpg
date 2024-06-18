import { z } from "zod";
import {
  CreateNpcTemplateSchema,
  UpdateNpcTemplateSchema,
} from "../../zod/NpcTemplate";
import prisma from "../prisma";

const list = () => {
  return prisma.npcTemplate.findMany({
    include: {
      species: { select: { id: true, name: true } },
      color: { select: { id: true, name: true } },
    },
  });
};

const findById = (id: number) => {
  return prisma.npcTemplate.findUnique({
    where: { id },
    include: {
      species: { select: { name: true } },
      color: { select: { name: true } },
    },
  });
};

const create = (data: z.infer<typeof CreateNpcTemplateSchema>) => {
  const { speciesId, colorId, ...otherData } = data;
  return prisma.npcTemplate.create({
    data: {
      species: { connect: { id: speciesId } },
      color: { connect: { id: colorId } },
      ...otherData,
    },
  });
};

const update = (id: number, data: z.infer<typeof UpdateNpcTemplateSchema>) => {
  const { speciesId, colorId, ...otherData } = data;
  return prisma.npcTemplate.update({
    where: { id },
    data: {
      ...(speciesId ? { species: { connect: { id: speciesId } } } : {}),
      ...(colorId ? { color: { connect: { id: colorId } } } : {}),
      ...otherData,
    },
  });
};

const npcTemplateQuery = {
  list,
  findById,
  create,
  update,
};

export default npcTemplateQuery;
