import { ACTION_OPTIONS, PveBattleActionSchema } from "../../zod/PveBattle";
import { Response } from "express";
import {
  ActorWithStats,
  PetWithColorSpecies,
  PveBattleWithOpponents,
} from "../../types/types";
import sendErrorResponse from "../sendErrorResponse";
import sendResponse from "../sendResponse";
import { z } from "zod";
import { calcAllVirtualStats } from "./calcVirtualStats";
import calcBattle from "./calcBattle";
import battleLog from "./battleLog";

const handlePveBattleAction = async (
  res: Response,
  data: z.infer<typeof PveBattleActionSchema>,
  battle: PveBattleWithOpponents,
  userPet: PetWithColorSpecies
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

  const pet = actorsWithAction.find((actor) => {
    return actor.id === petComparisonId;
  });
  const petTarget = actorsWithAction.find((actor) => {
    return actor.id === data.targetId;
  });
  if (!pet || !petTarget) {
    sendErrorResponse(res, "Error executing action. Check data and try again.");
    return;
  }

  const log = battleLog();

  for (const actor of actorsWithAction) {
    log.actorTurn(actor);
    // Can only act if health and mood > 0
    if (actor.currentHealth <= 0 || actor.currentMood <= 0) {
      if (actor.currentHealth === 0 && actor.currentMood === 0) {
        log.actorAshes(actor);
      } else if (actor.currentHealth === 0) {
        log.actorDead(actor);
      } else {
        log.actorMindless(actor);
      }
      continue;
    }

    if (
      actor.action === ACTION_OPTIONS.attack ||
      actor.action === ACTION_OPTIONS.insult
    ) {
      // Handle attack
      // Handle insult
      const target = actor.id === petComparisonId ? petTarget : pet;
      const didHit = calcBattle.hit(actor.accuracy, target.speed);
      const didAttack = actor.action === ACTION_OPTIONS.attack;
      const { damage, didCrit } = calcBattle.damage(
        didAttack ? actor.power : actor.wit
      );
      log.actorAttacked(actor, target, didHit, didCrit, damage);
      continue;
    }

    if (actor.action === ACTION_OPTIONS.defend) {
      // Handle defend
      continue;
    }

    if (actor.action === ACTION_OPTIONS.run) {
      // Handle run
    }
  }

  const logData = log.data;

  // Can only attack target with health and mood > 0
  // Add attacks and results to log as they happen
  sendResponse(res, "Attack successful!", {
    actorsBySpeed,
    logData,
  });
};

export default handlePveBattleAction;
