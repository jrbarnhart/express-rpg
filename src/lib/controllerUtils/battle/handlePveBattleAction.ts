/*     1. Verify target
    2. Calculate damage and apply to npc instances
    3. If no foes remain (currentHealth/Mood > 0) then set battle isActive = false 
       and isVictory = true and send victory response
    4. For each remaining enemy 
        a. Determine action (attack, defend)
        b. Calculate damage
    5. Apply damage to user pet
    6. If pet dies (currentHealth/Mood <= 0) then set battle isActive = false
       and send loss response
    7. Send default battle response */
import { PveBattleActionSchema } from "../../zod/PveBattle";
import { Response } from "express";
import { PveBattleWithOpponents } from "../../types/types";
import sendErrorResponse from "../sendErrorResponse";
import { Pet } from "@prisma/client";
import sendResponse from "../sendResponse";
import { z } from "zod";
import calcVirtualStats from "./calcVirtualStats";

const attack = (
  res: Response,
  data: z.infer<typeof PveBattleActionSchema>,
  battle: PveBattleWithOpponents,
  userPet: Pet
) => {
  if (!data.targetId) {
    sendErrorResponse(res, "No target was declared for your attack.");
    return;
  }

  const opponentIds: number[] = [];
  for (const opponent of battle.opponents) {
    opponentIds.push(opponent.id);
  }

  if (!opponentIds.includes(data.targetId)) {
    sendErrorResponse(
      res,
      "Cannot attack opponent that is not a part of this battle."
    );
    return;
  }

  const { totalStat: userPetSpeed } = calcVirtualStats.speed(userPet);
  // Determine attack order based on speed
  // Apply attacks. Can only attack if health and mood > 0
  // Can only attack target with health and mood > 0
  // Add attacks and results to log as they happen
  sendResponse(res, "Attack successful!", { userPetSpeed });
};

const handlePveBattleAction = {
  attack,
};

export default handlePveBattleAction;
