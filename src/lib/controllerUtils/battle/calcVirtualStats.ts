import { NpcInstance, Pet } from "@prisma/client";
import { VirtualStats } from "../../types/types";

// Virtual stat modifiers should add up to 1, excepting currentBonus.
// This is so that the currentBonus will always be 0 to 25% of the base stat,
// proportional to health/currentHealth and mood/currentMood * modifiers
type StatModifiers = {
  byHealth: number;
  byMood: number;
};

type ModifyConfig = {
  currentBonus: number;
  [key: string]: number | StatModifiers;
};

type StatResult = {
  totalStat: number;
  bonusMod: number;
};

type StatCalculator = (petOrNpc: Pet | NpcInstance) => StatResult;

interface CalcVirtualStats {
  speed: StatCalculator;
  accuracy: StatCalculator;
  power: StatCalculator;
}

const MODIFY: ModifyConfig = {
  currentBonus: 0.25,
  speed: {
    byHealth: 0.75,
    byMood: 0.25,
  },
  accuracy: {
    byHealth: 0.25,
    byMood: 0.75,
  },
  power: {
    byHealth: 0.5,
    byMood: 0.5,
  },
};

const createStatCalculator = (
  statName: string,
  modify: StatModifiers
): StatCalculator => {
  return (petOrNpc: Pet | NpcInstance) => {
    const baseStat =
      petOrNpc.health * modify.byHealth + petOrNpc.mood * modify.byMood;
    const bonusMod =
      (petOrNpc.currentHealth / petOrNpc.health) * modify.byHealth +
      (petOrNpc.currentMood / petOrNpc.mood) * modify.byMood;
    const currentBonus = baseStat * MODIFY.currentBonus * bonusMod;
    const totalStat = baseStat + currentBonus;
    return {
      totalStat,
      bonusMod,
    };
  };
};

const calcVirtualStats = Object.entries(MODIFY).reduce((acc, [key, value]) => {
  if (key !== "currentBonus" && typeof value !== "number") {
    (acc as CalcVirtualStats)[key as keyof CalcVirtualStats] =
      createStatCalculator(key, value as StatModifiers);
  }
  return acc;
}, {} as CalcVirtualStats);

export const calcAllVirtualStats = (petOrNpc: Pet | NpcInstance) => {
  const { totalStat: speed, bonusMod: speedBonus } =
    calcVirtualStats.speed(petOrNpc);
  const { totalStat: accuracy, bonusMod: accuracyBonus } =
    calcVirtualStats.accuracy(petOrNpc);
  const { totalStat: power, bonusMod: powerBonus } =
    calcVirtualStats.power(petOrNpc);

  const allVirtualStats: VirtualStats = {
    speed,
    speedBonus,
    accuracy,
    accuracyBonus,
    power,
    powerBonus,
    id: petOrNpc.id,
  };

  return allVirtualStats;
};

export default calcVirtualStats;
