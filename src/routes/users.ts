import express from "express";
const usersRouter = express.Router();
import userController from "../controllers/userController";
import isAuthenticated from "../middleware/isAuthenticated";

usersRouter.get("/login-fail", userController.user_login_fail);
usersRouter.get("/login-success", userController.user_login_success);

usersRouter.post("/login", userController.user_login);

usersRouter.post("/logout", userController.user_logout);

usersRouter.get("/:id", userController.user_get);
usersRouter.put("/:id", isAuthenticated, userController.user_update);

usersRouter.get("/", userController.users_list);
usersRouter.post("/", userController.user_create);

export default usersRouter;
