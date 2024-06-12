import { Request, Response, NextFunction } from "express";
import passport, { AuthenticateCallback } from "passport";
import { iResponseJSON } from "../lib/types";

const isAuthenticated = (role: "admin" | "member" | "base" = "member") => {
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
      if (role === "admin") {
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
