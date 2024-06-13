import express from "express";
import colorController from "../controllers/colorController";
import isAuthenticated from "../middleware/isAuthenticated";
const colorsRouter = express.Router();

colorsRouter.put(
  "/:id",
  isAuthenticated("ADMIN"),
  colorController.color_update
);

colorsRouter.get("/", isAuthenticated("ADMIN"), colorController.colors_list);

colorsRouter.post("/", isAuthenticated("ADMIN"), colorController.color_create);

export default colorsRouter;
