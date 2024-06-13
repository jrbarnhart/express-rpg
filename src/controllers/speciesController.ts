import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma";
import sendResponse from "../lib/sendResponse";

const species_list = asyncHandler(async (req, res) => {
  const allSpecies = await prisma.species.findMany();

  sendResponse(res, "All species retrieved.", allSpecies);
});

const species_create = () => {};

const speciesController = { species_list, species_create };

export default speciesController;
