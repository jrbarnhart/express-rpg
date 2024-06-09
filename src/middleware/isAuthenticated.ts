import { Request, Response, NextFunction } from "express";
import passport, { AuthenticateCallback } from "passport";
import { iResponseJSON } from "../lib/types";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const callback: AuthenticateCallback = (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const responseJSON: iResponseJSON = {
        success: false,
        message: "Authorization required. Please log in and try again.",
      };
      res.json(responseJSON);
      return;
    }
    next();
  };
  passport.authenticate("jwt", { session: false }, callback)(req, res, next);
};

export default isAuthenticated;
