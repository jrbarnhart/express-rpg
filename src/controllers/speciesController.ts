import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma/prisma";
import sendResponse from "../lib/controllerUtils/sendResponse";
import validateRequestData from "../lib/zod/validateRequestData";
import { CreateSpeciesSchema, UpdateSpeciesSchema } from "../lib/zod/Species";
import handlePrismaError from "../lib/prisma/handlePrismaError";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";

const species_list = asyncHandler(async (req, res) => {
  const allSpecies = await prisma.species.findMany({
    include: { colors: { select: { id: true, name: true } } },
  });

  sendResponse(res, "All species retrieved.", allSpecies);
});

const species_get = asyncHandler(async (req, res) => {
  const species = await prisma.species.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { colors: { select: { id: true, name: true } } },
  });
  if (!species) {
    sendErrorResponse(res, "Species not found.");
  } else {
    sendResponse(res, "Species retrieved successfully.", species);
  }
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
    handlePrismaError(error, res, "Error while adding species to database.");
  }
});

const species_update = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, UpdateSpeciesSchema);

  if (!data) return;

  try {
    const updatedSpecies = await prisma.species.update({
      where: { id: parseInt(req.params.id) },
      data: { ...data },
      include: { colors: { select: { id: true, name: true } } },
    });

    sendResponse(res, "Species updated successfully.", updatedSpecies);
  } catch (error) {
    handlePrismaError(error, res, "Error while updating species.");
  }
});

const speciesController = {
  species_list,
  species_get,
  species_create,
  species_update,
};

export default speciesController;
