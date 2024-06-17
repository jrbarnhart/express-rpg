import asyncHandler from "express-async-handler";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";
import sendResponse from "../lib/controllerUtils/sendResponse";
import npcInstanceQueries from "../lib/prisma/queries/npcInstanceQueries";
import validateRequestData from "../lib/zod/validateRequestData";
import { CreateNpcInstanceSchema } from "../lib/zod/NpcInstance";
import handlePrismaError from "../lib/prisma/handlePrismaError";

const npc_instances_list = asyncHandler(async (req, res) => {
  const allNpcInstances = await npcInstanceQueries.list();

  sendResponse(res, "All npc instances retrieved.", allNpcInstances);
});

const npc_instance_get = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const foundInstance = await npcInstanceQueries.findById(id);

  if (!foundInstance) {
    sendErrorResponse(res, "Npc instance not found.");
  } else {
    sendResponse(res, "Npc instance retrieved successfully.", foundInstance);
  }
});

const npc_instance_create = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, CreateNpcInstanceSchema);

  if (!data) return;

  try {
    const newNpcInstance = await npcInstanceQueries.create(data);
    sendResponse(res, "New Npc Instance created.", newNpcInstance);
  } catch (error) {
    handlePrismaError(error, res, "Error while creating Npc Instance.");
  }
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
