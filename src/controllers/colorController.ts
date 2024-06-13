import asyncHandler from "express-async-handler";
import validateRequestData from "../lib/zod/validateRequestData";
import { ColorSchema } from "../lib/zod/Color";
import sendErrorResponse from "../lib/sendErrorResponse";

const color_create = asyncHandler(async (req, res) => {
  const data = validateRequestData(req.body.data, res, ColorSchema);

  if (!data) return; // Error response already sent

  sendErrorResponse(res, "NYI");

  // Do something with data
});

const colorController = {
  color_create,
};

export default colorController;
