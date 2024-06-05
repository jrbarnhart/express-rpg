import express from "express";
import dotenv from "dotenv";
import usersRouter from "./routes/users";
import petsRouter from "./routes/pets";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/users", usersRouter);
app.use("/pets", petsRouter);

export default app;
module.exports = app;
