import express from "express";
import speciesController from "../controllers/speciesController";
import isAuthenticated from "../middleware/auth/isAuthenticated";
const speciesRouter = express.Router();

speciesRouter.get(
  "/:id",
  isAuthenticated("ADMIN"),
  speciesController.species_get
);

speciesRouter.put(
  "/:id",
  isAuthenticated("ADMIN"),
  speciesController.species_update
);

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
