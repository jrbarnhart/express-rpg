import asyncHandler from "express-async-handler";
import sendResponse from "../lib/controllerUtils/sendResponse";
import pveBattleQuery from "../lib/prisma/queries/pveBattlesQuery";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";

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
  sendResponse(res, "NYI");
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
