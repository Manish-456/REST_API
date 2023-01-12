class CustomErrorHandler extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static alreadyRegistered(message) {
    return new CustomErrorHandler(409, message);
  }

  static wrongCredentials(message = "invalid email or password!") {
    return new CustomErrorHandler(401, message);
  }

  static unAuthorized(message = "You are not authorized") {
    return new CustomErrorHandler(401, message);
  }

  static notFound(message = "User not found") {
    return new CustomErrorHandler(404, message);
  }

  static serverError(message = "Internal Server Error") {
    return new CustomErrorHandler(500, message);
  }
}

export default CustomErrorHandler;
