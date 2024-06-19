import express from "express";
import isAuthenticated from "../middleware/auth/isAuthenticated";
import pveBattleController from "../controllers/pveBattleController";
const battlesRouter = express.Router();

// PvE Battles
battlesRouter.get("/pve/:id", pveBattleController.pve_battle_get);

battlesRouter.put(
  "/pve/:id",
  isAuthenticated(),
  pveBattleController.pve_battle_update
);

battlesRouter.post(
  "/pve/:id",
  isAuthenticated(),
  pveBattleController.pve_battle_action
);

battlesRouter.get("/pve", pveBattleController.pve_battle_list);

battlesRouter.post(
  "/pve",
  isAuthenticated(),
  pveBattleController.pve_battle_create
);

export default battlesRouter;
