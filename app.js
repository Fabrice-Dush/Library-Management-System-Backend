import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

//? dotenv configuration
dotenv.config({ path: `./config.env` });

//? middlewares

//? body parser
app.use(express.json());

//? serving static files
app.use(express.static("./public"));

app.use("/api/v1/users", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);

export default app;
