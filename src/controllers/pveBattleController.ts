import asyncHandler from "express-async-handler";
import sendResponse from "../lib/controllerUtils/sendResponse";
import pveBattleQuery from "../lib/prisma/queries/pveBattlesQuery";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";
import selectBattleTemplates from "../lib/controllerUtils/selectBattleTemplates";
import userQuery from "../lib/prisma/queries/userQuery";
import { iNewBattleData } from "../lib/types/types";
import handlePrismaError from "../lib/prisma/handlePrismaError";

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
  if (!req.user?.id) {
    console.error(
      "Authenticated user's credentials were not found in pve_battle_create. Check auth middleware in route."
    );
    sendErrorResponse(res, "User credentials not found.");
    return;
  }

  const userId = req.user.id;
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
  sendResponse(res, "NYI");
});

const pve_battle_action = asyncHandler(async (req, res) => {
  sendResponse(res, "NYI");
});

const pveBattleController = {
  pve_battle_list,
  pve_battle_get,
  pve_battle_create,
  pve_battle_update,
  pve_battle_action,
};

export default pveBattleController;
