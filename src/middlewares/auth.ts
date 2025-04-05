import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../exceptions/unauthorized';
import { ErrorCode } from '../exceptions/root';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { prismaClient } from '..';

const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  const token = request.headers.authorization;
  if (!token) {
    return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }


  try {
    let JWT_SECRET = `${process.env.JWT_SECRET}`;

    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await prismaClient.user.findFirst({
      where: {
        id: payload.userId
      }
    })

    if (!user) {
      return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }

    request.user = user;
    
    return next();
  } catch (error) {
    return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }

}

export default authMiddleware;