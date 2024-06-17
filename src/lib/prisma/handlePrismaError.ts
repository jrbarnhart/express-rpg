import { Prisma } from "@prisma/client";
import { iResponseDataError } from "../types/types";
import sendErrorResponse from "../controllerUtils/sendErrorResponse";
import { Response } from "express";

// Prisma Error Codes: https://www.prisma.io/docs/orm/reference/error-reference#error-codes
type ErrorCode = "P2002" | "P2003" | "P2025";

const createErrorData = (
  code: ErrorCode,
  metaDataField: unknown,
  message: string
) => {
  const errorData: iResponseDataError = {
    errors: {},
  };

  switch (code) {
    case "P2002":
      if (Array.isArray(metaDataField)) {
        const target: string = metaDataField[0];
        errorData.errors[target] = [message.replace("{target}", target)];
        return errorData;
      }
      break;
    case "P2003":
      if (typeof metaDataField === "string") {
        const splitString = metaDataField.split("_");
        const field = splitString[1];
        errorData.errors[field] = ["This is not a valid id."];
        return errorData;
      }
      break;
    case "P2025":
      if (typeof metaDataField === "string") {
        errorData.errors["database"] = [
          "Record(s) not found. Please check your request and try again.",
        ];
        return errorData;
      }
      break;
  }

  return undefined;
};

const formatPrismaError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return createErrorData(
          "P2002",
          error.meta?.target,
          "That {target} is already in use."
        );
      case "P2003":
        return createErrorData(
          "P2003",
          error.meta?.field_name,
          "The provided key for {target} is invalid."
        );
      case "P2025":
        return createErrorData("P2025", error.meta?.cause, "");
    }
  }
  return undefined;
};

const handlePrismaError = (error: unknown, res: Response, message: string) => {
  console.log(error);
  sendErrorResponse(res, message, formatPrismaError(error));
};

export default handlePrismaError;
