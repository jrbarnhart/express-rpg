import asyncHandler from "express-async-handler";
import sendResponse from "../lib/controllerUtils/sendResponse";
import prisma from "../lib/prisma/prisma";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";

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
  // validate data
  // try catch prisma create
  sendResponse(res, "NYI");
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
