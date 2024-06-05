import express from "express";
import petController from "../controllers/petController";
const router = express.Router();

router.get("/", petController.pets_get);

export default router;
