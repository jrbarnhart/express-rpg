import { Prisma } from "@prisma/client";
import { iErrorData } from "./types";

const formatPrismaError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint error
    if (error.code === "P2002") {
      const meta = error.meta;
      const targetArray = meta?.target;
      if (Array.isArray(targetArray)) {
        const target: string = targetArray[0];
        const errorData: iErrorData = {
          errors: {},
        };
        errorData.errors[target] = [
          `That ${target} is already in use. Please log in or choose another ${target}.`,
        ];
        return errorData;
      }
    }
  }
  return undefined;
};

export default formatPrismaError;
