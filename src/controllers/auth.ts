import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/bad-request";
import { UnprocessableEntity } from "../exceptions/validation";
import { SignUpSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";

export const signup = async (request: Request, response: Response, next: NextFunction) => {
  SignUpSchema.parse(request.body);
  const { name, email, password } = request.body;
  let user = await prismaClient.user.findFirst({
    where: {
      email
    }
  })

  if (user) {
    next(new BadRequestException('User already exists', ErrorCode.USER_ALREADY_EXIST));
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  response.json({
    status: 'success',
    data: user
  })
};


export const login = async (request: Request, response: Response) => {
  const { email, password } = request.body;
  let user = await prismaClient.user.findFirst({
    where: {
      email
    }
  })

  if (!user) {
    throw new NotFoundException('user does not exist', ErrorCode.USER_NOT_FOUND)
  }

  const checkPassword = await bcrypt.compareSync(password, user.password);

  if (!checkPassword) {
    throw new BadRequestException('invalid password', ErrorCode.INCORRECT_PASSWORD)
  }


  let JWT_SECRET = `${process.env.JWT_SECRET}`;

  const token = jwt.sign({
    userId: user.id
  }, JWT_SECRET, {
    expiresIn: '1h'
  });



  response.json({
    status: 'success',
    data: user,
    token
  })
};



export const currentUser = async (request: Request, response: Response) => {
  response.json({ user: request.user });
};