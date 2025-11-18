import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";

const app = express();

//? dotenv configuration
dotenv.config({ path: `./config.env` });

//? middlewares

//? body parser
app.use(express.json());

//? serving static files
app.use(express.static("./public"));

app.use("/api/v1/users", authRouter);

export default app;
