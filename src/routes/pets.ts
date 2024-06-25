import express from "express";
import petController from "../controllers/petController";
import isAuthenticated from "../middleware/auth/isAuthenticated";
import canCreatePet from "../middleware/pet/canCreatePet";
const petsRouter = express.Router();

petsRouter.post("/:id/feed", isAuthenticated(), petController.pet_feed);

petsRouter.post("/:id/interact", isAuthenticated(), petController.pet_interact);

petsRouter.post(
  "/:id/activate",
  isAuthenticated(),
  petController.pet_set_active
);

petsRouter.get("/:id", petController.pet_get);

petsRouter.put("/:id", isAuthenticated(), petController.pet_update);

petsRouter.get("/", petController.pets_list);

petsRouter.post("/", isAuthenticated(), canCreatePet, petController.pet_create);

export default petsRouter;
