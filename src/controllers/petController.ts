import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma/prisma";
import sendResponse from "../lib/controllerUtils/sendResponse";
import sendErrorResponse from "../lib/controllerUtils/sendErrorResponse";

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
  res.json({
    pet: {
      id: 1,
      name: "coolpet",
      age: "0 hours",
      health: 100,
      mood: 100,
    },
  });
});

const pet_update = asyncHandler(async (req, res) => {
  res.json({
    pet: {
      id: req.params.id,
      name: "updatedpet",
      age: "0 hours",
      health: 100,
      mood: 100,
    },
  });
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
