import express from "express";
const router = express.Router();
import userController from "../controllers/userController";

router.get("/", userController.users_get);

router.post("/", userController.user_create);

router.put("/:id", userController.user_update);

export default router;
