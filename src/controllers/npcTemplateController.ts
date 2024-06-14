import asyncHandler from "express-async-handler";
import sendResponse from "../lib/controllerUtils/sendResponse";

const npc_templates_list = asyncHandler(async (req, res) => {
  // fetch and return data
  sendResponse(res, "NYI");
});

const npc_template_get = asyncHandler(async (req, res) => {
  // fetch and return data by param id
  sendResponse(res, "NYI");
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
