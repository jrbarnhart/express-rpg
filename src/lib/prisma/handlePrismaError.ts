import { Prisma } from "@prisma/client";
import { iResponseDataError } from "../types/types";
import sendErrorResponse from "../controllerUtils/sendErrorResponse";
import { Response } from "express";

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

const handlePrismaError = (error: unknown, res: Response, message: string) => {
  console.log(error);
  sendErrorResponse(res, message, formatPrismaError(error));
};

export default handlePrismaError;
