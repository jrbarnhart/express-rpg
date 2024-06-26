import asyncHandler from "express-async-handler";
import sendResponse from "../lib/controllerUtils/sendResponse";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";
import validateRequestData from "../lib/zod/validateRequestData";
import { CreatePetSchema, UpdatePetSchema } from "../lib/zod/Pet";
import handlePrismaError from "../lib/prisma/handlePrismaError";
import petQuery from "../lib/prisma/queries/petQuery";
import { NewPetData } from "../lib/types/types";
import speciesQuery from "../lib/prisma/queries/speciesQuery";
import getUserId from "../lib/controllerUtils/getUserId";

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

  const petSpecies = await speciesQuery.findById(data.speciesId);
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
    const id = parseInt(req.params.id);
    const updatedPet = await petQuery.update(id, data);
    sendResponse(res, "Pet updated successfully.", updatedPet);
  } catch (error) {
    handlePrismaError(error, res, "Error while updating pet.");
  }
});

const pet_feed = asyncHandler(async (req, res) => {
  const petId = parseInt(req.params.id);

  const userId = getUserId(req, res);
  if (!userId) return;

  const pet = await petQuery.findById(petId);
  if (!pet) {
    sendErrorResponse(res, "Pet was not found.");
    return;
  }
  if (pet.ownerId !== userId) {
    sendErrorResponse(res, "You cannot feed pets that do not belong to you.");
    return;
  }

  try {
    const fedPet = await petQuery.update(petId, { currentHealth: pet.health });
    sendResponse(res, "Pet fed successfully.", fedPet);
  } catch (error) {
    handlePrismaError(error, res, "Error while feeding pet.");
  }
});

const pet_interact = asyncHandler(async (req, res) => {
  const petId = parseInt(req.params.id);

  const userId = getUserId(req, res);
  if (!userId) return;

  const pet = await petQuery.findById(petId);
  if (!pet) {
    sendErrorResponse(res, "Pet was not found.");
    return;
  }
  if (pet.ownerId !== userId) {
    sendErrorResponse(
      res,
      "You cannot interact with pets that do not belong to you."
    );
    return;
  }

  try {
    const fedPet = await petQuery.update(petId, { currentMood: pet.mood });
    sendResponse(res, "Pet interacted with successfully.", fedPet);
  } catch (error) {
    handlePrismaError(error, res, "Error while interacting with pet.");
  }
});

const pet_set_active = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    console.error(
      "Authenticated user's credentials were not found in pve_battle_create. Check auth middleware in route."
    );
    sendErrorResponse(res, "User credentials not found.");
    return;
  }

  const userId = req.user?.id;
  const petId = parseInt(req.params.id);

  const pet = await petQuery.findById(petId);
  if (!pet) {
    sendErrorResponse(res, "Cannot activate pet. That pet was not found.");
    return;
  }

  if (pet.ownerId !== userId) {
    sendErrorResponse(
      res,
      "Cannot activate that pet. It does not belong to you."
    );
    return;
  }

  try {
    const [, activePet] = await petQuery.setActive(petId, userId);
    sendResponse(res, "Pet activated.", activePet);
  } catch (error) {
    handlePrismaError(error, res, "Error while activating pet.");
  }
});

const petController = {
  pets_list,
  pet_get,
  pet_create,
  pet_update,
  pet_feed,
  pet_interact,
  pet_set_active,
};

export default petController;
