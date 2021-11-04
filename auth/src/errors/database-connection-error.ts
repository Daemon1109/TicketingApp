import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  private reason = 'Error connecting to Database';

  constructor(statusCode?: number) {
    super('Error connecting to database');

    if (statusCode != undefined) {
      this.statusCode = statusCode;
    }

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors = () => {
    return [{ message: this.reason }];
  };
}
