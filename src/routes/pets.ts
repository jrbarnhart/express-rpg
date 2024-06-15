import express from "express";
import petController from "../controllers/petController";
const petsRouter = express.Router();

petsRouter.put("/:id/feed", petController.pet_feed);

petsRouter.put("/:id/interact", petController.pet_interact);

petsRouter.get("/:id", petController.pet_get);

petsRouter.put("/:id", petController.pet_update);

petsRouter.get("/", petController.pets_list);

petsRouter.post("/", petController.pet_create);

export default petsRouter;
