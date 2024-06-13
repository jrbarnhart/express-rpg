import asyncHandler from "express-async-handler";
import validateRequestData from "../lib/zod/validateRequestData";
import { ColorSchema } from "../lib/zod/Color";
import sendErrorResponse from "../lib/sendErrorResponse";
import prisma from "../lib/prisma";
import sendResponse from "../lib/sendResponse";
import formatPrismaError from "../lib/formatPrismaError";

const colors_list = asyncHandler(async (req, res) => {
  const allColors = await prisma.color.findMany();

  sendResponse(res, "All colors retrieved.", allColors);
});

const color_create = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, ColorSchema);

  if (!data) return; // Error response already sent

  try {
    const newColor = await prisma.color.create({
      data: {
        name: data.name,
      },
    });

    sendResponse(res, "New color added.", newColor);
  } catch (error) {
    const formattedPrismaError = formatPrismaError(error);
    console.log(error);
    sendErrorResponse(
      res,
      "Error adding color to database.",
      formattedPrismaError
    );
  }
});

const colorController = {
  colors_list,
  color_create,
};

export default colorController;
