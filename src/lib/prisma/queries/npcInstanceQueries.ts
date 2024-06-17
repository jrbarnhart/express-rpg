import prisma from "../prisma";

const list = async () => {
  return await prisma.npcInstance.findMany();
};

const npcInstanceQueries = { list };

export default npcInstanceQueries;
