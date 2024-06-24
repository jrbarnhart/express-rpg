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
import { ActorWithStats, PveBattleWithOpponents } from "../../types/types";
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

  const petStats = calcAllVirtualStats(userPet);
  const petWithStats = { ...userPet, ...petStats };
  // Set id to distinguish pet stats from npc instance stats and never overlap
  const petComparisonId = -999;
  petWithStats.id = petComparisonId;

  const opponentsWithStats = battle.opponents.map((opponent) => {
    return { ...opponent, ...calcAllVirtualStats(opponent) };
  });

  const actorsWithStats: ActorWithStats[] = [
    petWithStats,
    ...opponentsWithStats,
  ];

  const actorsBySpeed = calcBattle.actorOrder(actorsWithStats);

  const actorsWithAction = calcBattle.actions(
    actorsBySpeed,
    petComparisonId,
    data.action
  );

  const target = actorsWithAction.find((actor) => {
    return actor.id === data.targetId;
  });
  if (!target) {
    sendErrorResponse(
      res,
      "Target was not found. Check targetId and try again."
    );
    return;
  }

  const log: string[] = [];

  for (const actor of actorsWithAction) {
    log.push(`${actor.name}'s turn:`);
    // Can only act if health and mood > 0
    if (actor.currentHealth <= 0 || actor.currentMood <= 0) {
      continue;
    }

    /*    Replace data.action with the determiend action 
      if (
      data.action === ACTION_OPTIONS.attack ||
      data.action === ACTION_OPTIONS.insult
    ) {
      // Handle attack
      // Handle insult
      continue;
    }

    if (data.action === ACTION_OPTIONS.defend) {
      // Handle defend
      continue;
    }

    if (data.action === ACTION_OPTIONS.run) {
      // Handle run
    } */

    if (actor.id === petComparisonId) {
      // calc damage to target
      const didHit = calcBattle.hit(petStats.accuracy, target.speed);

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
    } else {
      // Do npc action
    }
  }

  // Can only attack target with health and mood > 0
  // Add attacks and results to log as they happen
  sendResponse(res, "Attack successful!", {
    actorsBySpeed,
    log,
  });
};

export default handlePveBattleAction;
