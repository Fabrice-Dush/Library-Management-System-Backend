import User from "../models/userModel.js";

export const deleteMe = async function (req, res, next) {
  try {
    //? get password and check if there is user associated to it
    const user = await User.findOne({ password: req.body.password });
  } catch (err) {}
};

export const getMe = async function (req, res, next) {
  try {
    const user = await User.findOne(req.user._id);

    res.status(200).json({
      status: "success",
      message: "Data fetched successfully!",
      data: { user },
    });
  } catch (err) {
    req
      .status(500)
      .json({ status: "fail", message: err.message, errors: { err } });
  }
};

export const updateMe = async function (req, res, next) {
  try {
  } catch (err) {}
};

export const getUsers = async function (req, res, next) {
  try {
  } catch (err) {}
};
