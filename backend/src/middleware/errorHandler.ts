import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Interface for custom API errors
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found error handler (404)
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Resource not found - ${req.originalUrl}`);
  next(error);
};

// Global error handler middleware
export const errorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const message = err.message || 'Something went wrong';
  
  // Log the error
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (statusCode === 500) {
    logger.error(err.stack);
  }
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

// Async handler to avoid try-catch in every controller
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};