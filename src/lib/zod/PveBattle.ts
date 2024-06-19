import { z } from "zod";
import { CreateNpcInstanceSchema } from "./NpcInstance";

export const CreatePveBattleSchema = z.object({
  opponents: z.array(CreateNpcInstanceSchema).max(6),
});

export const UpdatePveBattleSchema = z.object({
  isActive: z.boolean().optional(),
  isVictory: z.boolean().optional(),
});
