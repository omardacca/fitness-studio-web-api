export class ApiError extends Error {
    statusCode: number;
  
    constructor(statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
  
      // Set prototype explicitly (for TS inheritance behavior)
      Object.setPrototypeOf(this, ApiError.prototype);
    }
}
  