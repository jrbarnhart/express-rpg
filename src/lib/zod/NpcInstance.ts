import { z } from "zod";
import { attributeSchema, idSchema, name64Schema } from "./Global";

export const CreateNpcInstanceSchema = z.object({
  name: name64Schema,
  templateId: idSchema,
  health: attributeSchema,
  mood: attributeSchema,
  battleId: attributeSchema.optional(),
});

export const UpdateNpcInstanceSchema = z.object({
  name: name64Schema.optional(),
  templateId: idSchema.optional(),
  health: attributeSchema.optional(),
  currentHealth: attributeSchema.optional(),
  currentMood: attributeSchema.optional(),
  mood: attributeSchema.optional(),
  battleId: attributeSchema.optional(),
});
