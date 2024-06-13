import { Response } from "express";
import { iResponseJSON } from "./types";

const sendErrorResponse = (res: Response, message: string) => {
  const responseJSON: iResponseJSON = {
    success: false,
    message,
  };
  res.json(responseJSON);
};

export default sendErrorResponse;
