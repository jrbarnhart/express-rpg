import { z } from "zod";

export const CreateColorSchema = z.object({
  name: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Name must be at least one character" })
    .max(64, { message: "Name must be at most 64 characters" }),
});

export const UpdateColorSchema = z.object({
  id: z.number().int().positive(),
  name: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Name must be at least one character" })
    .max(64, { message: "Name must be at most 64 characters" }),
});
