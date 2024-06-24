import { ActorWithAction, ActorWithStats } from "../../types/types";
import { ACTION_OPTIONS } from "../../zod/PveBattle";

const hit = (attackerAccuracy: number, targetSpeed: number, k = 0.1) => {
  const maxPenalty = 0.5;
  const exponent = k * (targetSpeed - attackerAccuracy);
  const sigmoid = 1 / (1 + Math.exp(exponent));
  const hitChance = 1 - maxPenalty * sigmoid;
  return Math.random() < hitChance;
};

const damage = (attackerPower: number) => {
  const critChance = 0.05;
  const powerMod = 0.2;
  const didCrit = Math.random() < critChance;
  const critMod = didCrit ? 1.5 : 1;
  return { damage: Math.round(attackerPower * powerMod * critMod), didCrit };
};

const defenseRecovery = (power: number, wit: number) => {
  return Math.round(0.05 * (power + wit));
};

const actorOrder = (actorsWithStats: ActorWithStats[]) => {
  const actorsBySpeed = actorsWithStats.sort((a, b) => {
    if (a.speed < b.speed) {
      return 1;
    } else if (a.speed > b.speed) {
      return -1;
    }
    return 0; // Maybe randomize this later to be 50/50?
  });

  return actorsBySpeed;
};

const actions = (
  actors: ActorWithStats[],
  petComparisonId: number,
  petAction: ACTION_OPTIONS
) => {
  const actorsWithActions: ActorWithAction[] = actors.map((actor) => {
    if (actor.id === petComparisonId) {
      return { ...actor, action: petAction };
    }
    // Should it defend
    if (
      actor.currentHealth / actor.health < 0.25 ||
      actor.currentMood / actor.mood < 0.25
    ) {
      const defendChance = 0.35;
      const didDefend = Math.random() <= defendChance;
      if (didDefend) {
        return { ...actor, action: ACTION_OPTIONS.defend };
      }
    }

    const threshold = 1.2;
    if (actor.power > actor.wit * threshold) {
      return { ...actor, action: ACTION_OPTIONS.attack };
    }
    if (actor.wit > actor.power * threshold) {
      return { ...actor, action: ACTION_OPTIONS.insult };
    }
    const didAttack = Math.random() < 0.5;
    if (didAttack) {
      return { ...actor, action: ACTION_OPTIONS.attack };
    }
    return { ...actor, action: ACTION_OPTIONS.insult };
  });
  return actorsWithActions;
};

const calcBattle = {
  hit,
  damage,
  defenseRecovery,
  actorOrder,
  actions,
};

export default calcBattle;
