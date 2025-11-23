import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import { createToken } from "../utils/helpers.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const compareToken = function (token) {
  return crypto.createHash("sha256").update(token).digest("hex");
};

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
    next(new AppError(err));
  }
};

export const login = async function (req, res, next) {
  try {
    //? check if user email  and password is correct
    const user = await User.findOne({
      email: req.body.email,
    }).select("+password");

    if (!user || !(await user.verifyPassword(req.body.password, user.password)))
      next(new AppError("Wrong email or password", 401));

    //? create a new jwt
    const token = createToken(user);
    res.status(201).json({
      status: "success",
      message: "Logged in successfully!",
      token,
      data: { user },
    });
  } catch (err) {
    next(new AppError(err));
  }
};

export const forgotPassword = async function (req, res, next) {
  try {
    //? Get email and check if there is a user associated to it
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (!user) next(new AppError("User doesn't exist", 401));

    //?  Generate password reset token
    const passwordResetToken = user.generatePasswordResetToken();

    //? Create and send email to the user
    const subject = `Password reset token (expires in 10 minutes)`;
    const description = `To reset your password, send a patch request to ${req.protocol}://${req.hostname}:${process.env.PORT}/api/v1/auth/resetPassword/${passwordResetToken}, along with your new password.`;

    await sendEmail({ email: user.email, subject, description });

    //? save the user
    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({ status: "success", message: "Check your email for reset token" });
  } catch (err) {
    next(new AppError(err));
  }
};

export const resetPassword = async function (req, res, next) {
  try {
    //? Get reset token and check if there is user associated to it
    const user = await User.findOne({
      passwordResetToken: compareToken(req.params.token),
      passwordResetTokenExpiresIn: { $gt: Date.now() },
    });
    if (!user || !req.body.password || !req.body.passwordConfirm)
      next(
        new AppError(
          "Token incorrect or has expired or password not provided",
          401
        )
      );

    //? Update user password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    //? Update password changed at
    user.passwordChangedAt = new Date();

    //? Delete password reset token's fields
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;

    //? save user
    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "Password resetted successfully!" });
  } catch (err) {
    next(new AppError(err));
  }
};

export const updateMyPassword = async (req, res, next) => {
  try {
    //? Get user data from req.user.id (from protect middleware)
    const user = await User.findById(req.user.id).select("+password");

    if (
      !user ||
      !(await user.verifyPassword(req.body.currentPassword, user.password))
    )
      next(new AppError("User not found", 401));

    //? Set new password & confirm
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    //? Update password changed at property
    user.passwordChangedAt = new Date();

    //? Save user
    await user.save();

    res.status(200).json({
      status: "success",
      message: "User your new password next time you login",
    });
  } catch (err) {
    next(new AppError(err));
  }
};
