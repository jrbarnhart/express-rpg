import npcInstanceQuery from "../../prisma/queries/npcInstanceQuery";
import petQuery from "../../prisma/queries/petQuery";
import pveBattleQuery from "../../prisma/queries/pveBattlesQuery";
import { ActorWithAction, PveBattleWithOpponents } from "../../types/types";

const forAttack = (
  target: ActorWithAction,
  newHealth: number,
  petComparisonId: number,
  petDbId: number
) => {
  const isUserPet = target.id === petComparisonId;

  if (isUserPet) {
    return petQuery.update(petDbId, { currentHealth: newHealth });
  }

  return npcInstanceQuery.update(target.id, { currentHealth: newHealth });
};

const forInsult = (
  target: ActorWithAction,
  newMood: number,
  petComparisonId: number,
  petDbId: number
) => {
  const isUserPet = target.id === petComparisonId;

  if (isUserPet) {
    return petQuery.update(petDbId, { currentMood: newMood });
  }

  return npcInstanceQuery.update(target.id, { currentMood: newMood });
};

const forDefend = (
  actor: ActorWithAction,
  recoveryAmount: number,
  petComparisonId: number,
  petDbId: number
) => {
  const isUserPet = actor.id === petComparisonId;

  const newHealth = Math.min(
    actor.currentHealth + recoveryAmount,
    actor.health
  );

  const newMood = Math.min(actor.currentMood + recoveryAmount, actor.mood);

  if (isUserPet) {
    return petQuery.update(petDbId, {
      currentHealth: newHealth,
      currentMood: newMood,
    });
  }

  return npcInstanceQuery.update(actor.id, {
    currentHealth: newHealth,
    currentMood: newMood,
  });
};

const forUserRun = (actor: ActorWithAction, battle: PveBattleWithOpponents) => {
  return pveBattleQuery.update(battle.id, {
    isActive: false,
    isVictory: false,
  });
};

const getActionQuery = {
  forAttack,
  forInsult,
  forDefend,
  forUserRun,
};

export default getActionQuery;
