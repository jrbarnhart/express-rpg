import { z } from "zod";

export const SpeciesSchema = z.object({
  name: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Name must be at least one character" })
    .max(32, { message: "Name must be at most 32 characters" }),
  colors: z.array(z.number()).nonempty(),
});
