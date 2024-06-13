import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma/prisma";

const pets_list = asyncHandler(async (req, res) => {
  const petCount = await prisma.pet.count();
  res.json({ petCount, userPets: 0 });
});

const pet_get = asyncHandler(async (req, res) => {
  res.json({
    pet: {
      id: req.params.id,
      name: "specifipet",
      age: "0 hours",
      health: 100,
      mood: 100,
    },
  });
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
