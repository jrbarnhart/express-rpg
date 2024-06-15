import { z } from "zod";
import { idArraySchema, name32Schema } from "./Global";

export const CreateSpeciesSchema = z.object({
  name: name32Schema,
  colorIds: idArraySchema,
});

export const UpdateSpeciesSchema = z.object({
  name: name32Schema.optional(),
  colorIds: idArraySchema.optional(),
});
