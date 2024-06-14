import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { message: "Name must be at least one character" })
  .max(32, { message: "Name must be at most 32 characters" });

const colorIdsSchema = z.array(z.number()).nonempty();

export const CreateSpeciesSchema = z.object({
  name: nameSchema,
  colorIds: colorIdsSchema,
});

export const UpdateSpeciesSchema = z.object({
  name: nameSchema.optional(),
  colorIds: colorIdsSchema.optional(),
});
