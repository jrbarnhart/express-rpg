import asyncHandler from "express-async-handler";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";
import sendResponse from "../lib/controllerUtils/sendResponse";
import npcInstanceQueries from "../lib/prisma/queries/npcInstanceQueries";
import validateRequestData from "../lib/zod/validateRequestData";
import {
  CreateNpcInstanceSchema,
  UpdateNpcInstanceSchema,
} from "../lib/zod/NpcInstance";
import handlePrismaError from "../lib/prisma/handlePrismaError";

const npc_instances_list = asyncHandler(async (req, res) => {
  const allNpcInstances = await npcInstanceQueries.list();

  sendResponse(res, "All NPC instances retrieved.", allNpcInstances);
});

const npc_instance_get = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const foundInstance = await npcInstanceQueries.findById(id);

  if (!foundInstance) {
    sendErrorResponse(res, "NPC instance not found.");
  } else {
    sendResponse(res, "NPC instance retrieved successfully.", foundInstance);
  }
});

const npc_instance_create = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, CreateNpcInstanceSchema);

  if (!data) return;

  try {
    const newNpcInstance = await npcInstanceQueries.create(data);
    sendResponse(res, "New Npc instance created.", newNpcInstance);
  } catch (error) {
    handlePrismaError(error, res, "Error while creating NPC instance.");
  }
});

const npc_instance_update = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, UpdateNpcInstanceSchema);

  if (!data) return;

  const id = parseInt(req.params.id);

  try {
    const updatedNpcInstance = await npcInstanceQueries.update(id, data);
    sendResponse(res, "NPC instance updated successfully.", updatedNpcInstance);
  } catch (error) {
    handlePrismaError(error, res, "Error while updating NPC instance.");
  }
});

const npcInstanceController = {
  npc_instances_list,
  npc_instance_get,
  npc_instance_create,
  npc_instance_update,
};

export default npcInstanceController;
