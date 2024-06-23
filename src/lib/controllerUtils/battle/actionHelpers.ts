const calcHit = (attackerAccuracy: number, targetSpeed: number, k = 0.1) => {
  const maxPenalty = 0.5;
  const exponent = k * (targetSpeed - attackerAccuracy);
  const sigmoid = 1 / (1 + Math.exp(exponent));
  const hitChance = 1 - maxPenalty * sigmoid;
  return Math.random() < hitChance;
};

const calcDamage = (attackerPower: number) => {
  const critChance = 0.5;
  const powerMod = 0.2;
  const didCrit = Math.random() < critChance;
  const critMod = didCrit ? 1.5 : 1;
  return { damage: attackerPower * powerMod * critMod, didCrit };
};

const actionHelpers = {
  calcHit,
  calcDamage,
};

export default actionHelpers;
