import { Response } from "express";
import sendErrorResponse from "../sendErrorResponse";
import { ZodSchema, z } from "zod";

const validateRequestData = (
  data: unknown,
  res: Response,
  schema: ZodSchema
) => {
  if (!data) {
    sendErrorResponse(res, "Request body data was not found.");
    return false;
  }

  type ValidationErrors = z.inferFlattenedErrors<typeof schema>;

  const zodResult = schema.safeParse(data);

  if (!zodResult.success) {
    const flattenedErrors: ValidationErrors = zodResult.error.flatten();
    sendErrorResponse(
      res,
      "Incorrect data format.",
      flattenedErrors.fieldErrors
    );
    return false;
  }

  return zodResult.data;
};

export default validateRequestData;
