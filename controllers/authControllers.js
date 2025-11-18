import User from "../models/userModel.js";
import { createToken } from "../utils/helpers.js";

export const signup = async function (req, res, next) {
  try {
    //? create a user
    const user = await User.create(req.body);

    //? create a new jwt
    const token = createToken(user);

    res.status(201).json({
      status: "success",
      message: "Account created successfully!",
      token,
      data: { user },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "fail",
      message: err.message,
      errors: { err },
    });
  }
};

export const login = async function (req, res, next) {
  try {
    //? check if user email  and password is correct
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (!user) throw new Error("Wrong email or password");

    //? create a new jwt
    const token = createToken(user);
    res.status(201).json({
      status: "success",
      message: "Logged in successfully!",
      token,
      data: { user },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
      errors: { error: err },
    });
  }
};

export const forgotPassword = async function (req, res, next) {
  try {
  } catch (err) {}
};

export const resetPassword = async function (req, res, next) {
  try {
  } catch (err) {}
};

export const updateMyPassword = async function (req, res, next) {
  try {
  } catch (err) {}
};
