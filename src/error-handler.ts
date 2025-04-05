import { NextFunction, Response, Request } from 'express';
import { ErrorCode, HttpExceptions } from './exceptions/root';
import { InternalException } from './exceptions/internal-exceptions';
import { ZodError } from 'zod';
export const errorHandler = (method: Function) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      await method(request, response, next)
    } catch (err: any) {
      let exceptions: HttpExceptions;
      if (err instanceof HttpExceptions) {
        exceptions = err;
      } else {
        if (err instanceof ZodError) {
          exceptions = new InternalException("Unprocessable entity", err, ErrorCode.UNPROCESSABLE_ENTITY);
        } else {
          exceptions = new InternalException('Something Wrong', err, ErrorCode.INTERNAL_EXCEPTION)
        }
      }

      return next(exceptions);
    }
  }
}