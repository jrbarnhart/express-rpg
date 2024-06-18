import asyncHandler from "express-async-handler";
import validateRequestData from "../lib/zod/validateRequestData";
import { CreateColorSchema, UpdateColorSchema } from "../lib/zod/Color";
import sendResponse from "../lib/controllerUtils/sendResponse";
import handlePrismaError from "../lib/prisma/handlePrismaError";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";
import colorQuery from "../lib/prisma/queries/colorQuery";

const colors_list = asyncHandler(async (req, res) => {
  const allColors = await colorQuery.list();

  sendResponse(res, "All colors retrieved.", allColors);
});

const color_get = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const color = await colorQuery.findById(id);
  if (!color) {
    sendErrorResponse(res, "Color not found.");
  } else {
    sendResponse(res, "Color retrieved successfully.", color);
  }
});

const color_create = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, CreateColorSchema);

  if (!data) return; // Error response already sent

  try {
    const newColor = await colorQuery.create(data);
    sendResponse(res, "New color added.", newColor);
  } catch (error) {
    handlePrismaError(error, res, "Error while adding color to database.");
  }
});

const color_update = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, UpdateColorSchema);

  if (!data) return;

  try {
    const id = parseInt(req.params.id);
    const updatedColor = await colorQuery.update(id, data);
    sendResponse(res, "Color updated successfully.", updatedColor);
  } catch (error) {
    handlePrismaError(error, res, "Error while updating color.");
  }
});

const colorController = {
  colors_list,
  color_get,
  color_create,
  color_update,
};

export default colorController;
