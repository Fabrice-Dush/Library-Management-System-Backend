import express from "express";
import {
  createRent,
  approveRent,
  returnBook,
  penalizeUser,
  getAllRents,
  markRentAsOverdue,
} from "../controllers/rentController.js";
import { protect, restrictTo } from "../middleware/protect.js";

const router = express.Router();

router.use(protect);

router.route("/").post(restrictTo("student"), createRent).get(getAllRents);
router.patch("/:id/return", restrictTo("student"), returnBook);

router.use(restrictTo("admin"));
router.patch("/:id/approve", approveRent);
router.patch("/:id/penalize", penalizeUser);
router.patch("/:id/mark", markRentAsOverdue);

export default router;
