import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { message: "Name must be at least one character" })
  .max(64, { message: "Name must be at most 64 characters" });

export const CreateColorSchema = z.object({
  name: nameSchema,
});

export const UpdateColorSchema = z.object({
  name: nameSchema.optional(),
});
