import { z } from "zod";
import prisma from "../prisma";
import { CreateColorSchema, UpdateColorSchema } from "../../zod/Color";

const list = () => {
  return prisma.color.findMany();
};

const findById = (id: number) => {
  return prisma.color.findUnique({
    where: { id },
  });
};

const create = (data: z.infer<typeof CreateColorSchema>) => {
  return prisma.color.create({ data });
};

const update = (id: number, data: z.infer<typeof UpdateColorSchema>) => {
  return prisma.color.update({
    where: { id },
    data: { name: data.name },
  });
};

const colorQuery = {
  list,
  findById,
  create,
  update,
};

export default colorQuery;
