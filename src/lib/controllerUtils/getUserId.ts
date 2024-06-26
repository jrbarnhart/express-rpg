import { Request, Response } from "express";
import sendErrorResponse from "./sendErrorResponse";

const getUserId = (req: Request, res: Response) => {
  if (!req.user?.id) {
    console.error(
      "Authenticated user's credentials were not found in pve_battle_create. Check auth middleware in route."
    );
    sendErrorResponse(res, "User credentials not found.");
    return false;
  }
  return req.user.id;
};

export default getUserId;
