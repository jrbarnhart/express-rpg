import { z } from "zod";
import { idSchema, name32Schema } from "./Global";

export const CreatePetSchema = z.object({
  speciesId: idSchema,
  colorId: idSchema,
  name: name32Schema,
});

export const UpdatePetSchema = z.object({
  name: name32Schema.optional(),
});
