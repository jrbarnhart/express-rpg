import express from "express";
import petController from "../controllers/petController";
const petsRouter = express.Router();

petsRouter.get("/", petController.pets_list);

petsRouter.get("/:id", petController.pet_get);

petsRouter.post("/", petController.pet_create);

petsRouter.put("/:id", petController.pet_update);

petsRouter.put("/feed/:id", petController.pet_feed);

petsRouter.put("/interact/:id", petController.pet_interact);

export default petsRouter;
