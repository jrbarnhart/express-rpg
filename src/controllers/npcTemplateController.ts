import asyncHandler from "express-async-handler";
import sendResponse from "../lib/controllerUtils/sendResponse";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";
import validateRequestData from "../lib/zod/validateRequestData";
import {
  CreateNpcTemplateSchema,
  UpdateNpcTemplateSchema,
} from "../lib/zod/NpcTemplate";
import handlePrismaError from "../lib/prisma/handlePrismaError";
import npcTemplateQuery from "../lib/prisma/queries/npcTemplateQuery";

const npc_templates_list = asyncHandler(async (req, res) => {
  const allNpcTemplates = await npcTemplateQuery.list();
  sendResponse(res, "All NPC Templates retrieved.", allNpcTemplates);
});

const npc_template_get = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const npcTemplate = await npcTemplateQuery.findById(id);
  if (npcTemplate) {
    sendResponse(res, "NPC Template retrieved.", npcTemplate);
  } else {
    sendErrorResponse(res, "Cannot find template.");
  }
});

const npc_template_create = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, CreateNpcTemplateSchema);

  if (!data) return;

  try {
    const newNpcTemplate = await npcTemplateQuery.create(data);
    sendResponse(res, "NPC template created successfully.", newNpcTemplate);
  } catch (error) {
    handlePrismaError(error, res, "Error while creating NPC Template.");
  }
});

const npc_template_update = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, UpdateNpcTemplateSchema);

  if (!data) return;

  try {
    const id = parseInt(req.params.id);
    const updatedNpcTemplate = await npcTemplateQuery.update(id, data);
    sendResponse(res, "NPC Template updated successfully.", updatedNpcTemplate);
  } catch (error) {
    handlePrismaError(error, res, "Error while updating NPC Template.");
  }
});

const npcTemplateController = {
  npc_templates_list,
  npc_template_get,
  npc_template_create,
  npc_template_update,
};

export default npcTemplateController;
