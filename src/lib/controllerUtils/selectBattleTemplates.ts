import { NpcTemplate } from "@prisma/client";
import npcTemplateQuery from "../prisma/queries/npcTemplateQuery";

const selectBattleTemplates = async (targetBattlePower: number) => {
  if (targetBattlePower <= 0) {
    console.error("createNpcData targetBattlePower must be greater than 0");
    return false;
  }

  const paddedTargetPower = targetBattlePower + 200;
  const canBattleTemplates = await npcTemplateQuery.listCanBattle(
    paddedTargetPower
  );

  if (canBattleTemplates.length <= 0) {
    return false;
  }

  const minBattlePower = canBattleTemplates[0].battlePower;
  let totalBattlePower = 0;
  let keepGoing = true;
  let attempts = 0;
  const group: NpcTemplate[] = [];

  while (keepGoing && attempts < 1000) {
    const randomTemplateIndex = Math.floor(
      Math.random() * canBattleTemplates.length
    );

    if (
      totalBattlePower + canBattleTemplates[randomTemplateIndex].battlePower <
      paddedTargetPower
    ) {
      group.push(canBattleTemplates[randomTemplateIndex]);
      totalBattlePower += canBattleTemplates[randomTemplateIndex].battlePower;
    }

    // No reason to keep going if there isn't enough battle power "budget" left
    if (paddedTargetPower - totalBattlePower >= minBattlePower) {
      // Keep going randomly with less of a chance with larger and stronger groups
      const groupSizeMod = group.length * 0.05;
      const groupPowerMod = Math.min(
        0.25,
        (totalBattlePower / paddedTargetPower) * 0.25
      );
      keepGoing =
        Math.round(Math.random() - groupSizeMod - groupPowerMod) === 1;
    } else {
      keepGoing = false;
    }
    attempts++;
  }

  if (group.length <= 0) {
    // If group making failed return one copy of the strongest template
    group.push(canBattleTemplates[canBattleTemplates.length - 1]);
    return group;
  }

  return group;
};

export default selectBattleTemplates;
