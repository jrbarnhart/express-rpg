import express from "express";
import colorController from "../controllers/colorController";
import isAuthenticated from "../middleware/auth/isAuthenticated";
const colorsRouter = express.Router();

colorsRouter.get("/:id", colorController.color_get);

colorsRouter.put(
  "/:id",
  isAuthenticated("ADMIN"),
  colorController.color_update
);

colorsRouter.get("/", colorController.colors_list);

colorsRouter.post("/", isAuthenticated("ADMIN"), colorController.color_create);

export default colorsRouter;
