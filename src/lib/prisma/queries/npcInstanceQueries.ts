import prisma from "../prisma";

const list = () => {
  return prisma.npcInstance.findMany();
};

const npcInstanceQueries = { list };

export default npcInstanceQueries;
