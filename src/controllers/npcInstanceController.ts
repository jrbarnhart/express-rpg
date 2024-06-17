import asyncHandler from "express-async-handler";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";
import sendResponse from "../lib/controllerUtils/sendResponse";
import npcInstanceQueries from "../lib/prisma/queries/npcInstanceQueries";

const npc_instances_list = asyncHandler(async (req, res) => {
  const allNpcInstances = await npcInstanceQueries.list();

  sendResponse(res, "All npc instances retrieved.", allNpcInstances);
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
