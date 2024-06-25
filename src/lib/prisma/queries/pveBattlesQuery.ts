import { Prisma } from "@prisma/client";
import { iNewBattleData } from "../../types/types";
import prisma from "../prisma";
import { z } from "zod";
import { UpdatePveBattleSchema } from "../../zod/PveBattle";

const list = () => {
  return prisma.pveBattle.findMany({ include: { opponents: true } });
};

const findById = (id: number) => {
  return prisma.pveBattle.findUnique({
    where: { id },
    include: {
      opponents: {
        include: {
          template: {
            select: {
              color: { select: { name: true } },
              species: { select: { name: true } },
            },
          },
        },
      },
    },
  });
};

const create = (data: iNewBattleData) => {
  const { userId, opponentTemplates } = data;
  const npcInstanceData: Prisma.NpcInstanceCreateManyInput[] =
    opponentTemplates.map((template) => {
      return {
        name: template.name,
        health: template.health,
        mood: template.mood,
        currentHealth: template.health,
        currentMood: template.mood,
        templateId: template.id,
      };
    });

  return prisma.pveBattle.create({
    data: {
      user: { connect: { id: userId } },
      opponents: {
        createMany: {
          data: npcInstanceData,
        },
      },
    },
    include: {
      opponents: true,
    },
  });
};

const update = (id: number, data: z.infer<typeof UpdatePveBattleSchema>) => {
  return prisma.pveBattle.update({
    where: { id },
    data,
    include: { opponents: true },
  });
};

const findUserActiveBattle = (userId: number) => {
  return prisma.pveBattle.findFirst({ where: { userId, isActive: true } });
};

const pveBattleQuery = {
  list,
  findById,
  create,
  update,
  findUserActiveBattle,
};

export default pveBattleQuery;
