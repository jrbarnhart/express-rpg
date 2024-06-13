import { Response } from "express";
import { iResponseDataError, iResponseJSON } from "../types/types";

const sendErrorResponse = (
  res: Response,
  message: string,
  errorData?: iResponseDataError
) => {
  const responseJSON: iResponseJSON = {
    success: false,
    message,
  };
  if (errorData) {
    responseJSON.data = errorData;
  }
  res.json(responseJSON);
};

export default sendErrorResponse;
