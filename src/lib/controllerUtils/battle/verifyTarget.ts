import { z } from "zod";
import { PveBattleActionSchema } from "../../zod/PveBattle";
import { PveBattleWithOpponents, VirtualStats } from "../../types/types";
import { Response } from "express";
import sendErrorResponse from "../sendErrorResponse";

const verifyTarget = (
  res: Response,
  battle: PveBattleWithOpponents,
  data: z.infer<typeof PveBattleActionSchema>,
  opponentStats: VirtualStats[]
) => {
  const target = battle.opponents.find(
    (opponent) => opponent.id === data.targetId
  );
  if (!target) {
    sendErrorResponse(
      res,
      "Cannot attack opponent that is not a part of this battle."
    );
    return false;
  }

  const targetStats = opponentStats.find((stats) => stats.id === data.targetId);
  if (!targetStats) {
    sendErrorResponse(
      res,
      "Target's stats were not found. Check targetId and try again."
    );
    return false;
  }
  return { target, targetStats };
};

export default verifyTarget;
