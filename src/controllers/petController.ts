import asyncHandler from "express-async-handler";

const pets_get = asyncHandler(async (req, res) => {
  res.json({ petCount: 0, userPets: 0 });
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

const petController = { pets_get, pet_get, pet_create, pet_update };

export default petController;
