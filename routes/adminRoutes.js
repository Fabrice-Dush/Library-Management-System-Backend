import express from "express";
import {
  adminSignupMiddleware,
  userSignupMiddleware,
} from "../middleware/middleware.js";
import { login, signup } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signup", userSignupMiddleware, adminSignupMiddleware, signup);
router.post("/login", login);

export default router;
