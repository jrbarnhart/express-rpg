import express from "express";
import npcTemplateController from "../controllers/npcTemplateController";
import isAuthenticated from "../middleware/auth/isAuthenticated";
import npcInstanceController from "../controllers/npcInstanceController";
const npcRouter = express.Router();

// Templates
npcRouter.get("/templates/:id", npcTemplateController.npc_template_get);

npcRouter.put(
  "/templates/:id",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_template_update
);

npcRouter.get("/templates", npcTemplateController.npc_templates_list);

npcRouter.post(
  "/templates",
  isAuthenticated("ADMIN"),
  npcTemplateController.npc_template_create
);

// Instances
npcRouter.get("/instances/:id", npcInstanceController.npc_instance_get);

npcRouter.put(
  "/instances/:id",
  isAuthenticated(),
  npcInstanceController.npc_instance_update
);

npcRouter.get("/instances", npcInstanceController.npc_instances_list);

npcRouter.post(
  "/instances",
  isAuthenticated(),
  npcInstanceController.npc_instance_create
);

export default npcRouter;
