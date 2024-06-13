import { Response } from "express";
import sendErrorResponse from "../controllerUtils/sendErrorResponse";
import { ZodSchema } from "zod";

const validateRequestData = <T>(
  data: unknown,
  res: Response,
  schema: ZodSchema<T>
): T | false => {
  if (!data) {
    sendErrorResponse(res, "Request body data was not found.");
    return false;
  }

  const zodResult = schema.safeParse(data);

  if (!zodResult.success) {
    const flattenedErrors = zodResult.error.flatten();
    sendErrorResponse(res, "Incorrect data format.", {
      errors: flattenedErrors.fieldErrors,
    });
    return false;
  }

  return zodResult.data;
};

export default validateRequestData;
