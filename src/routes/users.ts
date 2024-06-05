import express from "express";
const usersRouter = express.Router();
import userController from "../controllers/userController";

usersRouter.get("/", userController.users_get);

usersRouter.post("/", userController.user_create);

usersRouter.put("/:id", userController.user_update);

export default usersRouter;
