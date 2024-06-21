import asyncHandler from "express-async-handler";
import sendResponse from "../lib/controllerUtils/sendResponse";
import pveBattleQuery from "../lib/prisma/queries/pveBattlesQuery";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";
import selectBattleTemplates from "../lib/controllerUtils/selectBattleTemplates";
import userQuery from "../lib/prisma/queries/userQuery";
import { iNewBattleData } from "../lib/types/types";
import handlePrismaError from "../lib/prisma/handlePrismaError";
import validateRequestData from "../lib/zod/validateRequestData";
import { UpdatePveBattleSchema } from "../lib/zod/PveBattle";
import getUserId from "../lib/controllerUtils/getUserId";

const pve_battle_list = asyncHandler(async (req, res) => {
  const allPveBattles = await pveBattleQuery.list();
  sendResponse(res, "All PvE battles retrieved successfully.", allPveBattles);
});

const pve_battle_get = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const foundPveBattle = await pveBattleQuery.findById(id);
  if (!foundPveBattle) {
    sendErrorResponse(res, "PvE battle not found.");
  } else {
    sendResponse(res, "PvE battle retrieved successfully.", foundPveBattle);
  }
});

const pve_battle_create = asyncHandler(async (req, res) => {
  const userId = getUserId(req, res);

  if (!userId) return;

  const user = await userQuery.findById(userId);
  if (!user) {
    sendErrorResponse(res, "Cannot create battle. User not found.");
    return;
  }

  const activePet = user.pets.find((pet) => pet.isActive);
  if (!activePet) {
    sendErrorResponse(
      res,
      "Cannot create battle. User does not have an active pet."
    );
    return;
  }

  // Users with an active battle shouldn't be able to start another
  const activeBattle = await pveBattleQuery.findUserActiveBattle(userId);
  if (activeBattle) {
    sendErrorResponse(
      res,
      "Cannot create battle. User already has an active battle."
    );
    return;
  }

  const targetBattlePower = activePet.health + activePet.mood;
  const opponentTemplates = await selectBattleTemplates(targetBattlePower);
  if (!opponentTemplates) {
    sendErrorResponse(res, "Cannot create battle. Opponents not found.");
    return;
  }

  const data: iNewBattleData = {
    opponentTemplates,
    userId,
  };

  try {
    const newPveBattle = await pveBattleQuery.create(data);
    sendResponse(res, "PvE battle created successfully.", newPveBattle);
  } catch (error) {
    handlePrismaError(error, res, "Error while creating PvE battle.");
  }
});

const pve_battle_update = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, UpdatePveBattleSchema);

  if (!data) return;

  try {
    const id = parseInt(req.params.id);
    const updatedBattle = await pveBattleQuery.update(id, data);
    sendResponse(res, "PvE battle updated successfully.", updatedBattle);
  } catch (error) {
    handlePrismaError(error, res, "Error while updating PvE battle.");
  }
});

const pve_battle_action = asyncHandler(async (req, res) => {
  const userId = getUserId(req, res);

  if (!userId) return;
});

const pveBattleController = {
  pve_battle_list,
  pve_battle_get,
  pve_battle_create,
  pve_battle_update,
  pve_battle_action,
};

export default pveBattleController;
