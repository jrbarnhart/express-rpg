import { NpcInstance } from "@prisma/client";
import { ActorWithStats, VirtualStats } from "../../types/types";
import { ACTION_OPTIONS } from "../../zod/PveBattle";

const hit = (attackerAccuracy: number, targetSpeed: number, k = 0.1) => {
  const maxPenalty = 0.5;
  const exponent = k * (targetSpeed - attackerAccuracy);
  const sigmoid = 1 / (1 + Math.exp(exponent));
  const hitChance = 1 - maxPenalty * sigmoid;
  return Math.random() < hitChance;
};

const damage = (attackerPower: number) => {
  const critChance = 0.5;
  const powerMod = 0.2;
  const didCrit = Math.random() < critChance;
  const critMod = didCrit ? 1.5 : 1;
  return { damage: attackerPower * powerMod * critMod, didCrit };
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

const opponentActions = (
  opponents: NpcInstance[],
  opponentStats: VirtualStats[]
) => {
  // Should it defend
  // Should it attack or insult
  // if (power >>> wit) then attack
  // if (wit >>> power) then insult
  // if (wit >< power) then attack based on lowest pet stat of mood or health
};

const calcBattle = {
  hit,
  damage,
  actorOrder,
  opponentActions,
};

export default calcBattle;
