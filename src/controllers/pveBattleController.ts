import asyncHandler from "express-async-handler";
import sendResponse from "../lib/controllerUtils/sendResponse";

const pve_battle_list = asyncHandler(async (req, res) => {
  sendResponse(res, "NYI");
});

const pve_battle_get = asyncHandler(async (req, res) => {
  sendResponse(res, "NYI");
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
