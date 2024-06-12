import { Request, Response, NextFunction } from "express";
import passport, { AuthenticateCallback } from "passport";
import { iResponseJSON } from "../lib/types";

const isAuthenticated = (isAdmin: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const callback: AuthenticateCallback = (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        const responseJSON: iResponseJSON = {
          success: false,
          message: "Authorization required. Check credentials and try again.",
        };
        res.json(responseJSON);
        return;
      }
      if (isAdmin) {
        // Do stuff
      }
      req.user = user;
      next();
    };
    passport.authenticate("jwt", { session: false }, callback)(req, res, next);
  };
};
export default isAuthenticated;
