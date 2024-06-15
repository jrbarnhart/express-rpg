import { z } from "zod";
import { idArraySchema } from "./Global";

const nameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { message: "Name must be at least one character" })
  .max(32, { message: "Name must be at most 32 characters" });

export const CreateSpeciesSchema = z.object({
  name: nameSchema,
  colorIds: idArraySchema,
});

export const UpdateSpeciesSchema = z.object({
  name: nameSchema.optional(),
  colorIds: idArraySchema.optional(),
});
