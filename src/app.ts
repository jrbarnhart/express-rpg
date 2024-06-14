import express from "express";
import dotenv from "dotenv";
import usersRouter from "./routes/users";
import petsRouter from "./routes/pets";
import colorsRouter from "./routes/colors";
import speciesRouter from "./routes/species";
import npcTemplateRouter from "./routes/npcTemplates";
import errorHandler from "./middleware/errorHandler";
import logger from "morgan";
import verifyTokenSecret from "./middleware/verifyTokenSecret";

import "./config/passport";
dotenv.config();

const app = express();

// Pre-Route Middleware
app.use(logger("dev"));
app.use(express.json());

// Ensure required env variables exist
app.use(verifyTokenSecret);

// Routes
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});
app.use("/users", usersRouter);
app.use("/pets", petsRouter);
app.use("/colors", colorsRouter);
app.use("/species", speciesRouter);
app.use("/templates", npcTemplateRouter);

// 404
app.use((req, res) => {
  res.json({ status: 404, message: "Resource not found." });
});

// Error Handler
app.use(errorHandler);

export default app;
module.exports = app;
