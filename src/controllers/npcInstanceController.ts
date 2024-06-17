import asyncHandler from "express-async-handler";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";

const npc_instances_list = asyncHandler(async (req, res) => {
  sendErrorResponse(res, "NYI");
});

const npc_instance_get = asyncHandler(async (req, res) => {
  sendErrorResponse(res, "NYI");
});

const npc_instance_create = asyncHandler(async (req, res) => {
  sendErrorResponse(res, "NYI");
});

const npc_instance_update = asyncHandler(async (req, res) => {
  sendErrorResponse(res, "NYI");
});

const npcInstanceController = {
  npc_instances_list,
  npc_instance_get,
  npc_instance_create,
  npc_instance_update,
};

export default npcInstanceController;
