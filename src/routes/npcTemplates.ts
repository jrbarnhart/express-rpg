import express from "express";
import npcTemplateController from "../controllers/npcTemplateController";
import isAuthenticated from "../middleware/auth/isAuthenticated";
const npcTemplateRouter = express.Router();

npcTemplateRouter.get(
  "/:id",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_template_get
);

npcTemplateRouter.put(
  "/:id",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_template_update
);

npcTemplateRouter.get(
  "/",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_templates_list
);

npcTemplateRouter.post(
  "/",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_template_create
);

export default npcTemplateRouter;
