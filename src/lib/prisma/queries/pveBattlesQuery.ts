import prisma from "../prisma";

const list = () => {
  return prisma.pveBattle.findMany({ include: { opponents: true } });
};

const findById = (id: number) => {
  return prisma.pveBattle.findUnique({
    where: { id },
    include: { opponents: true },
  });
};

const create = (data: unknown) => {
  return;
};

const update = (id: number, data: unknown) => {
  return;
};

const pveBattleQuery = {
  list,
  findById,
  create,
  update,
};

export default pveBattleQuery;
