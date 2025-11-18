import { filterObject } from "../utils/helpers.js";

export const userSignupMiddleware = function (req, res, next) {
  req.body = filterObject(
    req.body,
    "firstName",
    "lastName",
    "email",
    "password",
    "passwordConfirm"
  );

  next();
};

export const adminSignupMiddleware = function (req, res, next) {
  req.body.role = "admin";

  next();
};
