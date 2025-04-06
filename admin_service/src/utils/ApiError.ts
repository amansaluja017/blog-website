class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string = "Something went wrong",
    public errors: Array<string> = [],
    public stack = "",
    public data: any = null,
    public success: boolean = false
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = null;
    this.message = message;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
