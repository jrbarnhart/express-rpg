import asyncHandler from "express-async-handler";

const pets_get = asyncHandler(async (req, res) => {
  res.json({ petCount: 0, userPets: 0 });
});

const petController = { pets_get };

export default petController;
