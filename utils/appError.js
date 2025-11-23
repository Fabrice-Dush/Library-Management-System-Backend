class AppError {
  constructor(err, statusCode = 500) {
    this.name = err.name;
    this.message = err.message ?? err;
    this.statusCode = statusCode || 500;
    this.status = statusCode === 500 ? "error" : "fail";
    this.error = err;
    this.isOperational = true;
    this.code = err.code || null;
  }
}

export default AppError;
