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
import calcBattle from "./calcBattle";

const handlePveBattleAction = async (
  res: Response,
  data: z.infer<typeof PveBattleActionSchema>,
  battle: PveBattleWithOpponents,
  userPet: Pet
) => {
  if (!data.targetId) {
    sendErrorResponse(res, "No target was declared for your attack.");
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

  const target = battle.opponents.find(
    (opponent) => opponent.id === data.targetId
  );
  if (!target) {
    sendErrorResponse(
      res,
      "Cannot attack opponent that is not a part of this battle."
    );
    return;
  }
  const targetStats = allStats.find((stats) => stats.id === data.targetId);
  if (!targetStats) {
    sendErrorResponse(
      res,
      "Target's stats were not found. Check targetId and try again."
    );
    return;
  }

  // Keep track of what happens
  const log: string[] = [];

  // Apply attacks. Can only attack if health and mood > 0
  for (const attackerId of attackOrder) {
    if (attackerId === petComparisonId) {
      if (userPet.currentHealth > 0 && userPet.currentMood > 0) {
        // calc damage to target
        const didHit = calcBattle.hit(petStats.accuracy, targetStats.speed);

        const { damage, didCrit } = calcBattle.damage(petStats.power);

        const newCurrentHealth = Math.min(target.currentHealth - damage, 0);
        // log
        log.push(
          `Your pet attacked ${target.name}. ${
            didHit
              ? `It ${
                  didCrit ? "CRITICALLY " : ""
                }hit and did ${damage} health damage.`
              : "It missed..."
          }`
        );
        /* const updatedTarget = await npcInstanceQuery.update(data.targetId, {
          currentHealth: newCurrentHealth,
        }); */
      }
    } else {
      // Do npc attack
    }
  }

  // Can only attack target with health and mood > 0
  // Add attacks and results to log as they happen
  sendResponse(res, "Attack successful!", {
    petStats,
    opponentStats,
    log,
  });
};

export default handlePveBattleAction;
