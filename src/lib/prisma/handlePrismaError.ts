import { Prisma } from "@prisma/client";
import { iResponseDataError } from "../types/types";
import sendErrorResponse from "../controllerUtils/sendErrorResponse";
import { Response } from "express";

interface iErrorMetadata {
  target?: string[] | string;
  field_name?: string;
  cause?: string;
}

// Prisma Error Codes: https://www.prisma.io/docs/orm/reference/error-reference#error-codes
enum ErrorCode {
  UniqueConstraint = "P2002",
  InvalidForeignKey = "P2003",
  NotFound = "P2025",
}

const ERROR_MESSAGES = {
  [ErrorCode.UniqueConstraint]: "That {target} is already in use.",
  [ErrorCode.InvalidForeignKey]: "This is not a valid id.",
  [ErrorCode.NotFound]:
    "Record(s) not found. Please check your request and try again.",
};

const createErrorData = (
  code: ErrorCode,
  metaData: iErrorMetadata
): iResponseDataError | undefined => {
  const errorData: iResponseDataError = {
    errors: {},
  };

  switch (code) {
    case ErrorCode.UniqueConstraint:
      if (Array.isArray(metaData.target)) {
        const target: string = metaData.target[0];
        errorData.errors[target] = [
          ERROR_MESSAGES[code].replace("{target}", target),
        ];
        return errorData;
      }
      break;
    case ErrorCode.InvalidForeignKey:
      if (typeof metaData.field_name === "string") {
        const field = metaData.field_name.split("_")[1];
        errorData.errors[field] = [ERROR_MESSAGES[code]];
        return errorData;
      }
      break;
    case ErrorCode.NotFound:
      if (metaData.cause) {
        errorData.errors["database"] = [ERROR_MESSAGES[code]];
        return errorData;
      }
      break;
  }

  return undefined;
};

const formatPrismaError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return createErrorData(
      error.code as ErrorCode,
      error.meta as iErrorMetadata
    );
  }
  return undefined;
};

const handlePrismaError = (error: unknown, res: Response, message: string) => {
  console.log(error);
  sendErrorResponse(res, message, formatPrismaError(error));
};

export default handlePrismaError;
