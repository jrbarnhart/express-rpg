import { z } from "zod";
import { attributeSchema, idArraySchema, name32Schema } from "./Global";

export const CreateSpeciesSchema = z.object({
  name: name32Schema,
  colorIds: idArraySchema,
  baseHealth: attributeSchema,
  baseMood: attributeSchema,
});

export const UpdateSpeciesSchema = z.object({
  name: name32Schema.optional(),
  colorIds: idArraySchema.optional(),
  baseHealth: attributeSchema.optional(),
  baseMood: attributeSchema.optional(),
});
