import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    // console.error({ error: err.serializeErrors() });

    return res.status(err.statusCode).send({ error: err.serializeErrors() });
  }

  console.error({
    error: [{ message: err.message }],
  });

  res.status(500).send({
    error: [{ message: err.message }],
  });
};
