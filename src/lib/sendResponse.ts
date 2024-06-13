import { Response } from "express";
import { ResponseData, iResponseJSON } from "./types/types";

const sendResponse = (res: Response, message: string, data?: ResponseData) => {
  const responseJSON: iResponseJSON = {
    success: true,
    message,
  };
  if (data) {
    responseJSON.data = data;
  }
  res.json(responseJSON);
};

export default sendResponse;
