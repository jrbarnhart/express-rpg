import { z } from "zod";
import { idSchema } from "./Global";

const nameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { message: "Name is required" })
  .max(64, { message: "Name must be at most 64 characters long" });

const attributeSchema = z
  .number()
  .int({ message: "Health must be an integer" })
  .positive({ message: "Health must be positive" })
  .max(999, { message: "Health cannot be more than 999" });

export const CreateNpcTemplateSchema = z.object({
  name: nameSchema,
  speciesId: idSchema,
  colorId: idSchema,
  health: attributeSchema,
  mood: attributeSchema,
});

export const UpdateNpcTemplateSchema = z.object({
  name: nameSchema.optional(),
  speciesId: idSchema.optional(),
  colorId: idSchema.optional(),
  health: attributeSchema.optional(),
  mood: attributeSchema.optional(),
});
