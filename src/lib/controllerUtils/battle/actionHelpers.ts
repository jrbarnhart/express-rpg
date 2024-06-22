const calcHitChance = (
  attackerAccuracy: number,
  targetSpeed: number,
  k = 0.1
) => {
  const maxPenalty = 0.5;
  const exponent = k * (targetSpeed - attackerAccuracy);
  const sigmoid = 1 / (1 + Math.exp(exponent));
  const hitChance = 1 - maxPenalty * sigmoid;
  return hitChance;
};

const actionHelpers = {
  calcHitChance,
};

export default actionHelpers;
