import prisma from "../prisma";

const list = () => {
  return prisma.npcInstance.findMany();
};

const findById = (id: number) => {
  return prisma.npcInstance.findUnique({ where: { id: id } });
};

const npcInstanceQueries = { list, findById };

export default npcInstanceQueries;
