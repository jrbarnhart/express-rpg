import { z } from "zod";

export const UpdatePveBattleSchema = z.object({
  isActive: z.boolean().optional(),
  isVictory: z.boolean().optional(),
});
