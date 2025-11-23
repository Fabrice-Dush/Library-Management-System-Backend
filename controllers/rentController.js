import Rent from "../models/rentModel.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";

export const createRent = async function (req, res, next) {
  try {
    //? Get user rents
    const rents = await Rent.find({
      studentId: req.user.id,
      status: { $ne: "returned" },
    });

    if (rents.length)
      next(new AppError("You need to return the borrowed book first", 401));

    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) next(new AppError("Book not found", 404));

    if (book.status === "unavailable")
      next(new AppError("Book is unavailable", 400));

    const rent = await Rent.create({
      studentId: req.user._id,
      bookId,
      borrowDate: Date.now(),
      dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      status: "success",
      message: "Rent request created! Waiting for admin approval.",
      data: { rent },
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const approveRent = async function (req, res, next) {
  try {
    const rent = await Rent.findById(req.params.id);
    if (!rent) next(new AppError("Rent not found", 404));

    const book = await Book.findById(rent.bookId);
    if (!book) next(new AppError("Book not found", 404));

    if (book.quantity <= 0) next(new AppError("Book is not available", 400));

    //? approve rent
    rent.status = "approved";
    await rent.save();

    //? decrease quantity
    book.quantity -= 1;
    await book.save();

    res.status(200).json({
      status: "success",
      message: "Rent approved!",
      data: { rent },
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const returnBook = async function (req, res, next) {
  try {
    const rent = await Rent.findById(req.params.id);

    if (rent.status !== "approved")
      next(new AppError("Rent is not approved yet", 401));

    if (!rent) next(new AppError("Rent not found", 404));

    //? Mark rent as returned
    await Rent.findByIdAndUpdate(
      rent.id,
      { status: "returned" },
      { runValidators: true, new: true }
    );

    //? Increase the book quantity
    const book = await Book.findById(rent.bookId);

    book.quantity += 1;
    await book.save();

    res.status(200).json({
      status: "success",
      message: "Book returned successfully!",
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const penalizeUser = async function (req, res, next) {
  try {
    const rent = await Rent.findOne({
      id: req.params.id,
      status: { $ne: "unapproved" },
      dueDate: { $lte: new Date() },
    });

    if (!rent) next(new AppError("Rent not found", 404));

    const user = await User.findByIdAndUpdate(
      rent.studentId,
      { isPenalized: true },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Student penalized!",
      data: { user },
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const getAllRents = async function (req, res, next) {
  try {
    const filterObj =
      req.user.role === "student" ? { studentId: req.user.id } : {};

    //? Creating query
    const apiFeatures = new APIFeatures(Rent.find(filterObj), req.query)
      .filtering()
      .limitingFields()
      .sorting()
      .pagination();

    //? Executing query
    const rents = await apiFeatures.query;

    res.status(200).json({
      status: "success",
      message: "Rents fetched successfully!",
      results: rents.length,
      data: { rents },
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const markRentAsOverdue = async function (req, res, next) {
  try {
    //? Get rent
    const rent = await Rent.findOneAndUpdate(
      {
        _id: req.params.id,
        dueDate: { $lte: new Date() },
        status: "approved",
      },
      { status: "overdue" },
      { new: true, runValidators: true }
    );

    if (!rent) next(new AppError("Rent not found", 404));

    await User.findByIdAndUpdate(
      rent.studentId,
      { isPenalized: true },
      { runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "Rent marked as overdue",
      data: { rent },
    });
  } catch (err) {
    next(new AppError(err));
  }
};
