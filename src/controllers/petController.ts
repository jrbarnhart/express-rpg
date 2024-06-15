import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma/prisma";
import sendResponse from "../lib/controllerUtils/sendResponse";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";
import validateRequestData from "../lib/zod/validateRequestData";
import { CreatePetSchema, UpdatePetSchema } from "../lib/zod/Pet";
import handlePrismaError from "../lib/prisma/handlePrismaError";

const pets_list = asyncHandler(async (req, res) => {
  const somePets = await prisma.pet.findMany({
    take: 10,
    include: {
      color: { select: { name: true } },
      species: { select: { name: true } },
    },
  });

  sendResponse(res, "First ten pets retrieved scuccessfully.", somePets);
});

const pet_get = asyncHandler(async (req, res) => {
  const pet = await prisma.pet.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      color: { select: { name: true } },
      species: { select: { name: true } },
    },
  });

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
  });

  if (!petSpecies) {
    sendErrorResponse(res, "New pet's species was not found.");
    return;
  }

  const { baseHealth, baseMood } = petSpecies;

  const newPetData = { ...data, health: baseHealth, mood: baseMood };

  try {
    const newPet = await prisma.pet.create({ data: newPetData });

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
  res.json({ success: true, petId: req.params.id, petHealth: 100 });
});

const pet_interact = asyncHandler(async (req, res) => {
  res.json({ success: true, petId: req.params.id, petMood: 100 });
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
