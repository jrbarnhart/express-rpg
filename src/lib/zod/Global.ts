import { z } from "zod";

export const attributeSchema = z
  .number()
  .int({ message: "Health must be an integer" })
  .positive({ message: "Health must be positive" })
  .max(999, { message: "Health cannot be more than 999" });

export const idSchema = z
  .number()
  .int({ message: "Species ID must be an integer" })
  .positive({ message: "Species ID must be positive." });

export const idArraySchema = z.array(idSchema).nonempty();

export const name32Schema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { message: "Name must be at least one character" })
  .max(32, { message: "Name must be at most 32 characters" });

export const name64Schema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { message: "Name must be at least one character" })
  .max(64, { message: "Name must be at most 64 characters" });
