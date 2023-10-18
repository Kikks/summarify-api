class summarifyError extends Error {
  readonly name: string;
  public code: number;
  public message: string;

  constructor(message: string, code = 500) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
    this.code = code;
  }
}

export default summarifyError;
