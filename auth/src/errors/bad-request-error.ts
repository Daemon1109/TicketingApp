import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(private error: string, statusCode?: number) {
    super(error);

    if (statusCode) {
      this.statusCode = statusCode;
    }

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors = () => {
    return [{ message: this.error }];
  };
}
