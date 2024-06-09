import { NextFunction, Request, Response } from "express";

const verifyTokenSecret = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.TOKEN_SECRET === undefined) {
    const error = new Error(
      "Error: Missing TOKEN_SECRET environment variable."
    );
    next(error);
  } else {
    next();
  }
};

export default verifyTokenSecret;
