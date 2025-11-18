import express from "express";
import { login, signup } from "../controllers/authControllers.js";
import { userSignupMiddleware } from "../middleware/middleware.js";

const router = express.Router();

router.post("/signup", userSignupMiddleware, signup);
router.post("/login", login);

export default router;
