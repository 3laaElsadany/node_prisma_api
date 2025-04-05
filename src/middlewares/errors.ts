import { HttpExceptions } from "../exceptions/root";
import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (error: HttpExceptions, request: Request, response: Response, next: NextFunction) => {
  response.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors
  })
}