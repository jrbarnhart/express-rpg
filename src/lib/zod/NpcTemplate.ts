import { z } from "zod";
import { attributeSchema, idSchema, name64Schema } from "./Global";

export const CreateNpcTemplateSchema = z.object({
  name: name64Schema,
  speciesId: idSchema,
  colorId: idSchema,
  health: attributeSchema,
  mood: attributeSchema,
});

export const UpdateNpcTemplateSchema = z.object({
  name: name64Schema.optional(),
  speciesId: idSchema.optional(),
  colorId: idSchema.optional(),
  health: attributeSchema.optional(),
  mood: attributeSchema.optional(),
});
