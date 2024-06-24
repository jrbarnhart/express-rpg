import npcInstanceQuery from "../../prisma/queries/npcInstanceQuery";
import petQuery from "../../prisma/queries/petQuery";
import { ActorWithAction } from "../../types/types";

const forAttack = (
  actor: ActorWithAction,
  damage: number,
  petComparisonId: number
) => {
  const isUserPet = actor.id === petComparisonId;

  const newHealth = Math.min(actor.currentHealth - damage, 0);

  if (isUserPet) {
    return petQuery.update(actor.id, { currentHealth: newHealth });
  }

  return npcInstanceQuery.update(actor.id, { currentHealth: newHealth });
};

const forInsult = (
  actor: ActorWithAction,
  damage: number,
  petComparisonId: number
) => {
  const isUserPet = actor.id === petComparisonId;

  const newMood = Math.min(actor.currentMood - damage, 0);

  if (isUserPet) {
    return petQuery.update(actor.id, { currentMood: newMood });
  }

  return npcInstanceQuery.update(actor.id, { currentMood: newMood });
};

const forDefend = (
  actor: ActorWithAction,
  recoveryAmount: number,
  petComparisonId: number
) => {
  const isUserPet = actor.id === petComparisonId;

  const newHealth = Math.min(
    actor.currentHealth + recoveryAmount,
    actor.health
  );

  const newMood = Math.min(actor.currentMood + recoveryAmount, actor.mood);

  if (isUserPet) {
    return petQuery.update(actor.id, {
      currentHealth: newHealth,
      currentMood: newMood,
    });
  }

  return npcInstanceQuery.update(actor.id, {
    currentHealth: newHealth,
    currentMood: newMood,
  });
};

const getActionQuery = {
  forAttack,
  forInsult,
  forDefend,
};

export default getActionQuery;
