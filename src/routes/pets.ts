import express from "express";
import petController from "../controllers/petController";
const petsRouter = express.Router();

petsRouter.get("/", petController.pets_get);

petsRouter.get("/:id", petController.pet_get);

petsRouter.post("/", petController.pet_create);

petsRouter.put("/:id", petController.pet_update);

export default petsRouter;
