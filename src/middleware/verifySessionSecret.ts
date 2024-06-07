import { NextFunction, Request, Response } from "express";

const verifySessionSecret = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.SESSION_SECRET === undefined) {
    const error = new Error(
      "Error: Missing SESSION_SECRET environment variable."
    );
    next(error);
  } else {
    next();
  }
};

export default verifySessionSecret;
