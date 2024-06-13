import { Prisma } from "@prisma/client";
import { iResponseDataError } from "./types";

const formatPrismaError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint error
    if (error.code === "P2002") {
      const meta = error.meta;
      const targetArray = meta?.target;
      if (Array.isArray(targetArray)) {
        const target: string = targetArray[0];
        const errorData: iResponseDataError = {
          errors: {},
        };
        errorData.errors[target] = [`That ${target} is already in use.`];
        return errorData;
      }
    }
  }
  return undefined;
};

export default formatPrismaError;
