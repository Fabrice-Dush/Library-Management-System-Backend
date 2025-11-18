import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
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
      message: "Error creating a user",
      errors: { err },
    });
  }
};

export const login = async function (req, res, next) {
  try {
    console.log("Logging");
    console.log(req.body.email);
    //? check if user email  and password is the correct
    const user = await User.findOne({ email: req.body.email });
    console.log(user);

    if (!user || !(await user.verifyPassword(req.body.password, user.password)))
      throw new Error("Wrong email or password");

    //? create a new jwt
    const token = createToken(user);

    res.status(201).json({
      status: "success",
      message: "Logged in successfully!",
      token,
      data: { user },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "fail",
      message: "Error Logging you in!",
      errors: err,
    });
  }
};
