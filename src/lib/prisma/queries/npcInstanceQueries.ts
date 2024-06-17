import prisma from "../prisma";
import { z } from "zod";
import { CreateNpcInstanceSchema } from "../../zod/NpcInstance";

const list = () => {
  return prisma.npcInstance.findMany();
};

const findById = (id: number) => {
  return prisma.npcInstance.findUnique({ where: { id: id } });
};

const create = (data: z.infer<typeof CreateNpcInstanceSchema>) => {
  return prisma.npcInstance.create({
    data: {
      name: data.name,
      template: { connect: { id: data.templateId } },
      health: data.health,
      mood: data.mood,
      ...(data.battleId ? { battle: { connect: { id: data.battleId } } } : {}),
    },
  });
};

const npcInstanceQueries = { list, findById, create };

export default npcInstanceQueries;
