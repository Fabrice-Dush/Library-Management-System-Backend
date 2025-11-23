import Book from "../models/bookModel.js";
import APIFeatures from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";

export const createBook = async function (req, res, next) {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Book created successfully!",
      data: { book },
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const getAllBooks = async function (req, res, next) {
  try {
    //? Creating query
    const apiFeatures = new APIFeatures(Book.find(), req.query)
      .filtering()
      .limitingFields()
      .sorting()
      .pagination();

    //? 2. Executing query
    const books = await apiFeatures.query;

    res.status(200).json({
      status: "success",
      results: books.length,
      data: { books },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

export const getBook = async function (req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) next(new AppError("Book not found!", 404));

    res.status(200).json({
      status: "success",
      data: { book },
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const updateBook = async function (req, res, next) {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) next(new AppError("Book not found!", 404));

    res.status(200).json({
      status: "success",
      message: "Book updated successfully!",
      data: { book },
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const updateBookStatus = async function (req, res, next) {
  try {
    const { status } = req.body;

    const book = await Book.findById(req.params.id);
    if (!book) next(new AppError("Book not found!", 404));

    book.status = status;
    await book.save();

    res.status(200).json({
      status: "success",
      message: "Book status updated!",
      data: { book },
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const deleteBook = async function (req, res, next) {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) next(new AppError("Book not found!", 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(new AppError(err));
  }
};
