import prisma from "../prisma";
import { z } from "zod";
import {
  CreateNpcInstanceSchema,
  UpdateNpcInstanceSchema,
} from "../../zod/NpcInstance";

const list = () => {
  return prisma.npcInstance.findMany();
};

const findById = (id: number) => {
  return prisma.npcInstance.findUnique({ where: { id: id } });
};

const create = (data: z.infer<typeof CreateNpcInstanceSchema>) => {
  const { battleId, templateId, ...otherData } = data;

  return prisma.npcInstance.create({
    data: {
      template: { connect: { id: templateId } },
      ...(battleId ? { battle: { connect: { id: battleId } } } : {}),
      ...otherData,
      // New instances always have full current stats
      currentHealth: otherData.health,
      currentMood: otherData.mood,
    },
  });
};

const update = (id: number, data: z.infer<typeof UpdateNpcInstanceSchema>) => {
  const { battleId, templateId, ...otherData } = data;

  return prisma.npcInstance.update({
    where: { id },
    data: {
      ...(templateId ? { template: { connect: { id: templateId } } } : {}),
      ...(battleId ? { battle: { connect: { id: battleId } } } : {}),
      ...otherData,
    },
  });
};

const npcInstanceQuery = { list, findById, create, update };

export default npcInstanceQuery;
