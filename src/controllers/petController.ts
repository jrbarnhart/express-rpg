import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma/prisma";
import sendResponse from "../lib/controllerUtils/sendResponse";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";
import validateRequestData from "../lib/zod/validateRequestData";
import { CreatePetSchema, UpdatePetSchema } from "../lib/zod/Pet";
import handlePrismaError from "../lib/prisma/handlePrismaError";
import petQuery from "../lib/prisma/queries/petQuery";
import { NewPetData } from "../lib/types/types";

const pets_list = asyncHandler(async (req, res) => {
  const somePets = await petQuery.list();
  sendResponse(res, "First ten pets retrieved scuccessfully.", somePets);
});

const pet_get = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const pet = await petQuery.findById(id);

  if (!pet) {
    sendErrorResponse(res, "Pet not found.");
  } else {
    sendResponse(res, "Pet retrieved successfully.", pet);
  }
});

const pet_create = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, CreatePetSchema);

  if (!data) return;

  const petSpecies = await prisma.species.findUnique({
    where: { id: data.speciesId },
    include: { colors: true },
  });

  if (!petSpecies) {
    sendErrorResponse(res, "New pet's species was not found.");
    return;
  }

  const speciesColorIds = petSpecies.colors.map((entry) => entry.id);

  if (!speciesColorIds.includes(data.colorId)) {
    sendErrorResponse(res, "That color is not available for that pet species.");
    return;
  }

  const { baseHealth, baseMood } = petSpecies;

  const newPetData: NewPetData = {
    ...data,
    health: baseHealth,
    mood: baseMood,
    ownerId: req.user?.id || 0,
  };

  try {
    const newPet = await petQuery.create(newPetData);
    sendResponse(res, "Pet created successfully.", newPet);
  } catch (error) {
    handlePrismaError(error, res, "Error while creating pet.");
  }
});

const pet_update = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, UpdatePetSchema);

  if (!data) return;

  try {
    const updatedPet = await prisma.pet.update({
      where: { id: parseInt(req.params.id) },
      data,
    });

    sendResponse(res, "Pet updated successfully.", updatedPet);
  } catch (error) {
    handlePrismaError(error, res, "Error while updating pet.");
  }
});

const pet_feed = asyncHandler(async (req, res) => {
  sendResponse(res, "NYI");
});

const pet_interact = asyncHandler(async (req, res) => {
  sendResponse(res, "NYI");
});

const petController = {
  pets_list,
  pet_get,
  pet_create,
  pet_update,
  pet_feed,
  pet_interact,
};

export default petController;
