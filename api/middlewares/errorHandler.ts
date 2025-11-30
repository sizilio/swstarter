import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
import logger from '../lib/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  if (err instanceof AppError) {
    logger.warn(
      {
        code: err.code,
        message: err.message,
        path: req.path,
        method: req.method,
      },
      'Operational error'
    );
  } else {
    logger.error(
      {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
      },
      'Unexpected error'
    );
  }

  // Send response to client
  if (err instanceof AppError) {
    res.status(err.statusCode).json(err.toJSON());
    return;
  }

  // Unexpected error - don't expose details
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
  });
}
