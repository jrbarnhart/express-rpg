import { z } from "zod";

export const attributeSchema = z
  .number()
  .int({ message: "Attribute must be an integer" })
  .positive({ message: "Attribute must be positive" })
  .max(999, { message: "Attribute cannot be more than 999" });

export const attributeLargeSchema = z
  .number()
  .int({ message: "Attribute must be an integer" })
  .positive({ message: "Attribute must be positive" })
  .max(9999, { message: "Attribute cannot be more than 9999" });

export const idSchema = z
  .number()
  .int({ message: "ID must be an integer" })
  .positive({ message: "ID must be positive." });

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
