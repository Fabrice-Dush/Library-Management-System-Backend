import express from "express";
import { protect, restrictTo } from "../middleware/protect.js";
import {
  deleteMe,
  getMe,
  getUsers,
  updateMe,
} from "../controllers/userController.js";

const router = express.Router();

router.use(protect);

router.get("/me", getMe);
router.delete("/deleteMe", deleteMe);
router.patch("/updateMe", updateMe);

router.use(restrictTo("admin"));

router.route("/").get(getUsers);

router
  .route("/:id")
  .delete(protect, restrictTo("admin"))
  .get(protect, restrictTo("admin"));

export default router;
