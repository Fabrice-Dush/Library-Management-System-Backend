import User from "../models/userModel.js";
import APIFeatures from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import { filterObject } from "../utils/helpers.js";

export const getMe = async function (req, res, next) {
  try {
    const user = await User.findOne(req.user._id);

    res.status(200).json({
      status: "success",
      message: "Data fetched successfully!",
      data: { user },
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const updateMe = async function (req, res, next) {
  try {
    //? Block password updates here
    if (req.body.password || req.body.passwordConfirm)
      next(
        new AppError(
          "This route is not for password updates. Use /updateMyPassword instead",
          400
        )
      );

    //? Filter allowed fields
    const filteredBody = filterObject(req.body, "name", "email", "photo");

    //? Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Data updated successfully!",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const deleteMe = async function (req, res, next) {
  try {
    //? get password and check if there is user associated to it
    const user = await User.findOneAndUpdate(
      { id: req.user.id, password: req.body.password },
      { isActive: false },
      { runValidators: true, new: true }
    );

    if (!user) next(new AppError("User not found"));

    res.status(204).json({
      status: "success",
      message: "Your account was deleted successfully!",
      data: null,
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const getUsers = async function (req, res, next) {
  try {
    //? Creating query
    const apiFeatures = new APIFeatures(User.find(), req.query)
      .filtering()
      .limitingFields()
      .sorting()
      .pagination();

    //? Executing query
    const users = await apiFeatures.query;

    res.status(200).json({
      status: "success",
      message: "Users fetched successfully!",
      results: users.length,
      data: { users },
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: "fail", message: err.message, errors: { err } });
  }
};

export const getUser = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) next(new AppError("User not found"));

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const deleteUser = async function (req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) next(new AppError("User not found"));

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(new AppError(err));
  }
};
