import express from "express";
import petController from "../controllers/petController";
const petsRouter = express.Router();

petsRouter.get("/", petController.pets_get);

export default petsRouter;
