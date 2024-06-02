import express, { Request, Response } from "express";
import dotenv from "dotenv";
import playersRouter from "./routes/players";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/players", playersRouter);

app
  .listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
