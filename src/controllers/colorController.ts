import asyncHandler from "express-async-handler";
import validateRequestData from "../lib/zod/validateRequestData";
import { CreateColorSchema, UpdateColorSchema } from "../lib/zod/Color";
import prisma from "../lib/prisma/prisma";
import sendResponse from "../lib/controllerUtils/sendResponse";
import handlePrismaError from "../lib/prisma/handlePrismaError";

const colors_list = asyncHandler(async (req, res) => {
  const allColors = await prisma.color.findMany();

  sendResponse(res, "All colors retrieved.", allColors);
});

const color_create = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, CreateColorSchema);

  if (!data) return; // Error response already sent

  try {
    const newColor = await prisma.color.create({
      data: {
        name: data.name,
      },
    });

    sendResponse(res, "New color added.", newColor);
  } catch (error) {
    handlePrismaError(error, res, "Error while adding color to database.");
  }
});

const color_update = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, UpdateColorSchema);

  if (!data) return;

  try {
    const updatedColor = await prisma.color.update({
      where: { id: parseInt(req.params.id) },
      data: { name: data.name },
    });

    sendResponse(res, "Color updated successfully.", updatedColor);
  } catch (error) {
    handlePrismaError(error, res, "Error while updating color.");
  }
});

const colorController = {
  colors_list,
  color_create,
  color_update,
};

export default colorController;
