export class MovieError extends Error {
  constructor(readonly message: string) {
    super(message);
    Object.setPrototypeOf(this, MovieError.prototype);
    this.name = "ErrorMovie";
  }
}
