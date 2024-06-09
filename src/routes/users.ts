import express from "express";
const usersRouter = express.Router();
import userController from "../controllers/userController";

usersRouter.get("/", userController.users_list);

usersRouter.get("/:id", userController.user_get);

usersRouter.post("/", userController.user_create);

usersRouter.put("/:id", userController.user_update);

usersRouter.post("/login", userController.user_login);

usersRouter.get("/login-fail", userController.user_login_fail);

export default usersRouter;
