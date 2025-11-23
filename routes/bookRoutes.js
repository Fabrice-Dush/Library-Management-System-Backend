import express from "express";
import {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  updateBookStatus,
  deleteBook,
} from "../controllers/bookController.js";
import { protect, restrictTo } from "../middleware/protect.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllBooks).post(restrictTo("admin"), createBook);

router
  .route("/:id")
  .get(getBook)
  .patch(restrictTo("admin"), updateBook)
  .delete(restrictTo("admin"), deleteBook);

router.patch("/:id/status", restrictTo("admin"), updateBookStatus);

export default router;
