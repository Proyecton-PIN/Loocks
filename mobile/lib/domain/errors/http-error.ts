export class HttpError extends Error {
  public statusCode: number;

  constructor(statusCode: number, statusText: string) {
    super(statusText);
    this.statusCode = statusCode;
  }
}
