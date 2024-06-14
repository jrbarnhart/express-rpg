import { Prisma } from "@prisma/client";
import { iResponseDataError } from "../types/types";
import sendErrorResponse from "../controllerUtils/sendErrorResponse";
import { Response } from "express";

const createErrorData = (metaData: unknown, message: string) => {
  if (Array.isArray(metaData)) {
    const target: string = metaData[0];
    const errorData: iResponseDataError = {
      errors: {},
    };
    errorData.errors[target] = [message.replace("{target}", target)];
    return errorData;
  } else if (typeof metaData === "string") {
    const splitString = metaData.split("_");
    const field = splitString[1];
    const errorData: iResponseDataError = {
      errors: {},
    };
    errorData.errors[field] = ["This is not a valid id."];
    return errorData;
  }
  return undefined;
};

const formatPrismaError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return createErrorData(
          error.meta?.target,
          "That {target} is already in use."
        );
      case "P2003":
        return createErrorData(
          error.meta?.field_name,
          "The provided key for {target} is invalid."
        );
    }
  }
  return undefined;
};

const handlePrismaError = (error: unknown, res: Response, message: string) => {
  console.log(error);
  sendErrorResponse(res, message, formatPrismaError(error));
};

export default handlePrismaError;
