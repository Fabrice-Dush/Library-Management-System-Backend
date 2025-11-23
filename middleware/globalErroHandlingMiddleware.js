const globalErrorHandlingMiddleware = function (err, req, res, next) {
  //? I development, print the error as it is
  if (process.env.NODE_ENV === "development") {
    res
      .status(err.statusCode || 500)
      .json({ status: err.status, message: err.message, errors: { err } });
  }

  //  ? In production, format errors
  else if (process.env.NODE_ENV === "production") {
    //? Format operational errors

    if (err.isOperational) {
      //? Handle duplicate field error
      if (err.code === 11000) {
        err.message = `${err.error.keyValue.email} already exists`;
      }

      //? Handle ValidationError
      else if (err.name === "ValidationError") {
        err.message = `${err.message
          .slice(err.message.lastIndexOf(":") + 1)
          .trim()}`;
      }

      res
        .status(err.statusCode)
        .json({ status: err.status, message: err.message });
    }

    //? Send generic error message
    else {
      res
        .status(500)
        .json({ status: "error", message: "Something went very wrong" });
    }
  }
};

export default globalErrorHandlingMiddleware;
