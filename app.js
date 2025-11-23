import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import bookRouter from "./routes/bookRoutes.js";
import rentRouter from "./routes/rentRoutes.js";
import globalErrorHandlingMiddleware from "./middleware/globalErroHandlingMiddleware.js";

const app = express();

//? dotenv configuration
dotenv.config({ path: `./config.env` });

//? middlewares

//? body parser
app.use(express.json());

//? serving static files
app.use(express.static("./public"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/rents", rentRouter);

//? Global error handling middleware
app.use(globalErrorHandlingMiddleware);

export default app;
