import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma/prisma";
import sendResponse from "../lib/controllerUtils/sendResponse";
import validateRequestData from "../lib/zod/validateRequestData";
import { CreateSpeciesSchema } from "../lib/zod/Species";
import formatPrismaError from "../lib/prisma/handlePrismaError";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";

const species_list = asyncHandler(async (req, res) => {
  const allSpecies = await prisma.species.findMany();

  sendResponse(res, "All species retrieved.", allSpecies);
});

const species_create = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, CreateSpeciesSchema);

  if (!data) return;

  try {
    const newSpecies = await prisma.species.create({
      data: {
        name: data.name,
        colors: { connect: data.colorIds.map((id) => ({ id })) },
      },
    });

    sendResponse(res, "New species added.", newSpecies);
  } catch (error) {
    const formattedPrismaError = formatPrismaError(error);
    console.log(error);
    sendErrorResponse(
      res,
      "Error adding species to database.",
      formattedPrismaError
    );
  }
});

const speciesController = { species_list, species_create };

export default speciesController;
