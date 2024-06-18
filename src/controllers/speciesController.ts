import asyncHandler from "express-async-handler";
import sendResponse from "../lib/controllerUtils/sendResponse";
import validateRequestData from "../lib/zod/validateRequestData";
import { CreateSpeciesSchema, UpdateSpeciesSchema } from "../lib/zod/Species";
import handlePrismaError from "../lib/prisma/handlePrismaError";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";
import speciesQuery from "../lib/prisma/queries/speciesQuery";

const species_list = asyncHandler(async (req, res) => {
  const allSpecies = await speciesQuery.list();
  sendResponse(res, "All species retrieved.", allSpecies);
});

const species_get = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const foundSpecies = await speciesQuery.findById(id);
  if (!foundSpecies) {
    sendErrorResponse(res, "Species not found.");
  } else {
    sendResponse(res, "Species retrieved successfully.", foundSpecies);
  }
});

const species_create = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, CreateSpeciesSchema);

  if (!data) return;

  try {
    const newSpecies = await speciesQuery.create(data);
    sendResponse(res, "New species added.", newSpecies);
  } catch (error) {
    handlePrismaError(error, res, "Error while adding species to database.");
  }
});

const species_update = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, UpdateSpeciesSchema);

  if (!data) return;

  try {
    const id = parseInt(req.params.id);
    const updatedSpecies = await speciesQuery.update(id, data);
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
