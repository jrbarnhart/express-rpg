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
import { calcAllVirtualStats } from "./calcVirtualStats";

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

  // Calc the virtual stats for all competitors
  const petStats = calcAllVirtualStats(userPet);
  // Set id to distinguish pet stats from npc instance stats, and so pet id never overlaps
  const petComparisonId = -999;
  petStats.id = petComparisonId;
  const opponentStats = battle.opponents.map((opponent) => {
    return calcAllVirtualStats(opponent);
  });

  const allStats = [...opponentStats, petStats];

  // Determine attack order in ids based on speed
  const attackOrder = allStats
    .sort((a, b) => {
      if (a.speed < b.speed) {
        return -1;
      } else if (a.speed > b.speed) {
        return 1;
      }
      return 0;
    })
    .map((stats) => {
      return stats.id;
    });

  // Apply attacks. Can only attack if health and mood > 0
  for (const attackerId of attackOrder) {
    if (attackerId === petComparisonId) {
      // Do pet attack
    } else {
      // Do npc attack
    }
  }

  // Can only attack target with health and mood > 0
  // Add attacks and results to log as they happen
  sendResponse(res, "Attack successful!", {
    petStats,
    opponentStats,
  });
};

const handlePveBattleAction = {
  attack,
};

export default handlePveBattleAction;
