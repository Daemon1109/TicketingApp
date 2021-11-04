import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(private errors: ValidationError[], statusCode?: number) {
    super('Invalid Request parameters');

    if (statusCode != undefined) {
      this.statusCode = statusCode;
    }

    // Need to add this if we extend any built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors = () => {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  };
}
