import jwt from "jsonwebtoken";

export const filterObject = function (obj, ...fields) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (fields.includes(key)) acc[key] = value;
    return acc;
  }, {});
};

export const createToken = function (user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
