import { z } from "zod";

export const idSchema = z
  .number()
  .int({ message: "Species ID must be an integer" })
  .positive({ message: "Species ID must be positive." });

export const idArraySchema = z.array(idSchema).nonempty();
