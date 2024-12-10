export class FileError extends Error {
  constructor(readonly message: string) {
    super(message);
    Object.setPrototypeOf(this, FileError.prototype);
    this.name = "FileError";
  }
}
