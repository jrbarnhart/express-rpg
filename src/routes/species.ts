import express from "express";
import speciesController from "../controllers/speciesController";
import isAuthenticated from "../middleware/isAuthenticated";
const speciesRouter = express.Router();

speciesRouter.get(
  "/",
  isAuthenticated("ADMIN"),
  speciesController.species_list
);

speciesRouter.post(
  "/",
  isAuthenticated("ADMIN"),
  speciesController.species_create
);

export default speciesRouter;
