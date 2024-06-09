import express from "express";
const usersRouter = express.Router();
import userController from "../controllers/userController";
import isAuthenticated from "../middleware/isAuthenticated";

usersRouter.post("/login", userController.user_login);

usersRouter.get("/:id", userController.user_get);
usersRouter.put("/:id", isAuthenticated, userController.user_update);

usersRouter.get("/", userController.users_list);
usersRouter.post("/", userController.user_create);

export default usersRouter;
