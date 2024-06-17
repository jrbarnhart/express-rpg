import prisma from "../prisma";

const list = async () => {
  return await prisma.npcInstance.findMany();
};

const npcInstancesQueries = { list };

export default npcInstancesQueries;
