import express from "express";
import petController from "../controllers/petController";
import isAuthenticated from "../middleware/auth/isAuthenticated";
import canCreatePet from "../middleware/pet/canCreatePet";
const petsRouter = express.Router();

petsRouter.put("/:id/feed", isAuthenticated(), petController.pet_feed);

petsRouter.put("/:id/interact", isAuthenticated(), petController.pet_interact);

petsRouter.get("/:id", petController.pet_get);

petsRouter.put("/:id", isAuthenticated(), petController.pet_update);

petsRouter.get("/", petController.pets_list);

petsRouter.post("/", isAuthenticated(), canCreatePet, petController.pet_create);

export default petsRouter;
