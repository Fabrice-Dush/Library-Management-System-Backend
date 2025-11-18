import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

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

    if (!token) throw new Error("Login to get access");

    //? Check if the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //? Check if the user still exists
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("Account doesn't exist");

    //? Check if the user hasn't changed their password after token was issued
    const passwordChangedAt = Date.now(user.passwordChangedAt);
    const tokenIssuedAt = decoded.iat * 1000;
    console.log({ passwordChangedAt, tokenIssuedAt });

    if (passwordChangedAt > tokenIssuedAt)
      throw new Error(
        "Password was changed after the token was issued.Login again!"
      );

    //? granting access to the protected route
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      message: err.message,
      errors: { err },
    });
  }
};

export const restrictTo = (...roles) => {
  return async function (req, res, next) {
    try {
      if (!roles.includes(req.user.role))
        throw new Error("You don't have permission to access this resource");

      next();
    } catch (err) {
      res
        .status(500)
        .json({ status: "success", message: err.message, errors: { err } });
    }
  };
};
