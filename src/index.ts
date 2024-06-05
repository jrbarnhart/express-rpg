import express from "express";
import dotenv from "dotenv";
import usersRouter from "./routes/users";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/users", usersRouter);

export default app;
module.exports = app;
