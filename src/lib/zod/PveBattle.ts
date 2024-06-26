import { z } from "zod";
import { idSchema } from "./Global";

export const UpdatePveBattleSchema = z.object({
  isActive: z.boolean().optional(),
  isVictory: z.boolean().optional(),
});

export enum ACTION_OPTIONS {
  attack = "attack",
  insult = "insult",
  defend = "defend",
  run = "run",
}

export const PveBattleActionSchema = z
  .object({
    action: z.nativeEnum(ACTION_OPTIONS, {
      message: `Action invalid. Valid actions: ${ACTION_OPTIONS.attack}, ${ACTION_OPTIONS.insult}, ${ACTION_OPTIONS.defend}, ${ACTION_OPTIONS.run}`,
    }),
    targetId: idSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.action === ACTION_OPTIONS.attack && !data.targetId) {
        return false;
      }
      return true;
    },
    {
      message: "You must include a targetId with your attack action.",
      path: ["targetId"],
    }
  );
