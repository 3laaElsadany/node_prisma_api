import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../exceptions/unauthorized';
import { ErrorCode } from '../exceptions/root';

const adminMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  const user = request.user;
  if (user.role == 'ADMIN') {
    return next();
  } else {
    return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
}

export default adminMiddleware;