import { z } from "zod";

export const CreateSpeciesSchema = z.object({
  name: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Name must be at least one character" })
    .max(32, { message: "Name must be at most 32 characters" }),
  colorIds: z.array(z.number()).nonempty(),
});

export const UpdateSpeciesSchema = z.object({
  id: z.number().int().positive(),
  name: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Name must be at least one character" })
    .max(32, { message: "Name must be at most 32 characters" })
    .optional(),
  colorIds: z.array(z.number()).nonempty().optional(),
});
