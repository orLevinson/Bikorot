class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); //Add a "message" properties
    this.code = errorCode; //Add a "code" properties
  }
}

module.exports = HttpError;
