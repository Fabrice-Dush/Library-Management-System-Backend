import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authControllers.js";
import { userSignupMiddleware } from "../middleware/middleware.js";

const router = express.Router();

router.post("/signup", userSignupMiddleware, signup);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

export default router;
