import express from "express";
const router = express.Router();
import userController from "../controllers/userController";

router.get("/", userController.users_get);

export default router;
