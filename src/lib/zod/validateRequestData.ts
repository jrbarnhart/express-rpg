import { z } from "zod";
import { iResponseDataError } from "../types";

const validateRequestData = (
  data: unknown,
  schema: z.ZodSchema<unknown>
): { success: boolean; errorData?: iResponseDataError; data?: unknown } => {
  if (!data) {
    return {
      success: false,
      errorData: { errors: { data: ["No request data was found."] } },
    };
  }

  const validatedData = schema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      errorData: { errors: validatedData.error.flatten().fieldErrors },
    };
  }

  return { success: true, data: validatedData.data };
};

export default validateRequestData;
