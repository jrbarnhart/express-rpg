import { VirtualStats } from "../../types/types";

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

const actionOrderById = (allStats: VirtualStats[]) => {
  const actionOrder = allStats
    .sort((a, b) => {
      if (a.speed < b.speed) {
        return 1;
      } else if (a.speed > b.speed) {
        return -1;
      }
      return 0; // Maybe randomize this later to be 50/50?
    })
    .map((stats) => {
      return stats.id;
    });

  return actionOrder;
};

const calcBattle = {
  hit,
  damage,
  actionOrderById,
};

export default calcBattle;
