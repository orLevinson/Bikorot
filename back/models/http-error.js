class HttpError extends Error {
  constructor(message, errorCode, errorSuccess) {
    super(message); //Add a "message" properties
    this.code = errorCode; //Add a "code" properties
    this.success = errorSuccess; //Add a "success" properties
  }
}

module.exports = HttpError;
