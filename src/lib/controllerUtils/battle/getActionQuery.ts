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

const getActionQuery = {
  forAttack,
};

export default getActionQuery;
