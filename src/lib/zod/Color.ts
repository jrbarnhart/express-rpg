import { z } from "zod";
import { name64Schema } from "./Global";

export const CreateColorSchema = z.object({
  name: name64Schema,
});

export const UpdateColorSchema = z.object({
  name: name64Schema.optional(),
});
