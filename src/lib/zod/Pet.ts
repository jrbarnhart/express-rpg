import { z } from "zod";
import { attributeSchema, idSchema, name32Schema } from "./Global";

export const CreatePetSchema = z.object({
  speciesId: idSchema,
  colorId: idSchema,
  name: name32Schema,
});

export const UpdatePetSchema = z.object({
  name: name32Schema.optional(),
  currentHealth: attributeSchema.optional(),
  currentMood: attributeSchema.optional(),
});
