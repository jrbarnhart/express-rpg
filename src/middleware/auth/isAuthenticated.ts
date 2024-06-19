import { Request, Response, NextFunction } from "express";
import passport, { AuthenticateCallback } from "passport";
import { iResponseJSON } from "../../lib/types/types";

const isAuthenticated = (accessLevel: "ADMIN" | "MEMBER" | "BASE" = "BASE") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const callback: AuthenticateCallback = (err, user) => {
      if (err) {
        return next(err);
      }
      const responseJSON: iResponseJSON = {
        success: false,
        message: "Authorization required. Check credentials and try again.",
      };
      if (!user) {
        res.json(responseJSON);
        return;
      }
      if (accessLevel === "ADMIN" && user.role !== "ADMIN") {
        res.json(responseJSON);
        return;
      }
      if (accessLevel === "MEMBER" && user.role === "BASE") {
        res.json(responseJSON);
        return;
      }

      req.user = user;
      next();
    };
    passport.authenticate("jwt", { session: false }, callback)(req, res, next);
  };
};
export default isAuthenticated;
