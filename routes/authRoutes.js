import express from "express";
import {
  signup,
  login,
  forgotPassword,
  updateMyPassword,
  resetPassword,
} from "../controllers/authControllers.js";
import { userSignupMiddleware } from "../middleware/middleware.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/signup", userSignupMiddleware, signup);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword", resetPassword);
router.patch("/updateMyPassword", protect, updateMyPassword);

export default router;
