import asyncHandler from "express-async-handler";
import sendResponse from "../lib/controllerUtils/sendResponse";
import prisma from "../lib/prisma/prisma";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";
import validateRequestData from "../lib/zod/validateRequestData";
import { CreateNpcTemplateSchema } from "../lib/zod/NpcTemplate";
import handlePrismaError from "../lib/prisma/handlePrismaError";

const npc_templates_list = asyncHandler(async (req, res) => {
  const allNpcTemplates = await prisma.npcTemplate.findMany();
  sendResponse(res, "All NPC Templates retrieved.", allNpcTemplates);
});

const npc_template_get = asyncHandler(async (req, res) => {
  const npcTemplate = await prisma.npcTemplate.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (npcTemplate) {
    sendResponse(res, "NYI", npcTemplate);
  } else {
    sendErrorResponse(res, "Cannot find template.");
  }
});

const npc_template_create = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, CreateNpcTemplateSchema);

  if (!data) return;

  try {
    const newNpcTemplate = await prisma.npcTemplate.create({
      data: {
        name: data.name,
        speciesId: data.speciesId,
        colorId: data.colorId,
        health: data.health,
        mood: data.mood,
      },
    });

    sendResponse(res, "NPC template created successfully.", newNpcTemplate);
  } catch (error) {
    handlePrismaError(error, res, "Error while creating NPC Template");
  }
});

const npc_template_update = asyncHandler(async (req, res) => {
  // check user
  // validate data
  // try catch prisma create
  sendResponse(res, "NYI");
});

const npcTemplateController = {
  npc_templates_list,
  npc_template_get,
  npc_template_create,
  npc_template_update,
};

export default npcTemplateController;
