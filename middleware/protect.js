import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";

export const protect = async function (req, res, next) {
  try {
    let token;
    //? Get token and check if its there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ").at(-1);
    }

    if (!token) next(new AppError("Login to get access", 401));

    //? Check if the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //? Check if the user still exists
    const user = await User.findById(decoded.id);
    if (!user) next(new AppError("Account doesn't exist", 401));

    //? Check if the user hasn't changed their password after token was issued
    if (!user.checkPasswordChangedAfterTokenWasIssued(decoded.iat))
      next(
        new AppError(
          "Password was changed after the token was issued.Login again!",
          401
        )
      );

    //? granting access to the protected route
    req.user = user;
    next();
  } catch (err) {
    next(new AppError(err));
  }
};

export const restrictTo = (...roles) => {
  return async function (req, res, next) {
    try {
      if (!roles.includes(req.user.role))
        next(
          new AppError("You don't have permission to access this resource", 403)
        );

      next();
    } catch (err) {
      next(new AppError(err));
    }
  };
};
