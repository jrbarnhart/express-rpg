import express from "express";
import dotenv from "dotenv";
import usersRouter from "./routes/users";
import petsRouter from "./routes/pets";
import errorHandler from "./middleware/errorHandler";
import logger from "morgan";

dotenv.config();
const app = express();

// Pre-Route Middleware
app.use(logger("dev"));

// Routes
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});
app.use("/users", usersRouter);
app.use("/pets", petsRouter);

// 404
app.use((req, res) => {
  res.json({ status: 404, message: "Resource not found." });
});

// Error Handler
app.use(errorHandler);

export default app;
module.exports = app;