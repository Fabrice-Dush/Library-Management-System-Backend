import express from "express";
import { protect, restrictTo } from "../middleware/protect.js";
import {
  deleteMe,
  getMe,
  getUsers,
  updateMe,
  getUser,
  deleteUser,
} from "../controllers/userController.js";
import { updateMyPassword } from "../controllers/authControllers.js";

const router = express.Router();

router.use(protect);

router.get("/me", getMe);
router.delete("/deleteMe", deleteMe);
router.patch("/updateMe", updateMe);
router.patch("/updateMyPassword", updateMyPassword);

router.use(restrictTo("admin"));

router.route("/").get(getUsers);

router.route("/:id").delete(deleteUser).get(getUser);

export default router;
