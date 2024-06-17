import express from "express";
import npcTemplateController from "../controllers/npcTemplateController";
import isAuthenticated from "../middleware/auth/isAuthenticated";
const npcRouter = express.Router();

npcRouter.get(
  "/:id",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_template_get
);

npcRouter.put(
  "/:id",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_template_update
);

npcRouter.get(
  "/",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_templates_list
);

npcRouter.post(
  "/",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_template_create
);

export default npcRouter;
