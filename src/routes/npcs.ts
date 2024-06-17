import express from "express";
import npcTemplateController from "../controllers/npcTemplateController";
import isAuthenticated from "../middleware/auth/isAuthenticated";
const npcRouter = express.Router();

npcRouter.get(
  "/templates/:id",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_template_get
);

npcRouter.put(
  "/templates/:id",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_template_update
);

npcRouter.get(
  "/templates",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_templates_list
);

npcRouter.post(
  "/templates",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_template_create
);

export default npcRouter;
