import { Request, Response } from "express";
import { AddressSchema, RoleSchema, UpdateUserSchema } from "../schema/users";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/bad-request";


export const addAddress = async (request: Request, response: Response) => {
  AddressSchema.parse(request.body);

  const address = await prismaClient.address.create({
    data: {
      ...request.body,
      userId: request.user.id
    }
  })

  response.json({
    data: address
  })
}

export const deleteAddress = async (request: Request, response: Response) => {
  try {
    const id = parseInt(request.params.id);
    const address = await prismaClient.address.delete({
      where: { id }
    })
    response.json({ success: true });
  } catch (error) {
    throw new NotFoundException('Address not found', ErrorCode.PRODUCT_NOT_FOUND)
  }
}

export const listAddress = async (request: Request, response: Response) => {
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: request.user.id
    }
  });

  response.json({
    data: addresses
  });
}

export const updateUser = async (request: Request, response: Response) => {
  const validateData = UpdateUserSchema.parse(request.body);

  let shippingAddress = null;
  let billingAddress = null;

  if (validateData.defaultShippingAddress) {
    shippingAddress = await prismaClient.address.findFirst({
      where: { id: validateData.defaultShippingAddress },
    });

    if (!shippingAddress) {
      throw new NotFoundException('Shipping address not found', ErrorCode.ADDRESS_NOT_FOUND);
    }
    if (shippingAddress.userId != request.user.id) {
      throw new BadRequestException("Address does not belong to user", ErrorCode.ADDRESS_DOES_NOT_BELONG)
    }
  }

  if (validateData.defaultBillingAddress) {
    billingAddress = await prismaClient.address.findFirst({
      where: { id: validateData.defaultBillingAddress },
    });

    if (!billingAddress) {
      throw new NotFoundException('Billing address not found', ErrorCode.ADDRESS_NOT_FOUND);
    }
    if (billingAddress.userId != request.user.id) {
      throw new BadRequestException("Address does not belong to user", ErrorCode.ADDRESS_DOES_NOT_BELONG)
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: { id: request.user.id },
    data: {
      ...request.body
    }
  });

  response.json({ data: updatedUser });
};


export const listUsers = async (request: Request, response: Response) => {
  const skip = request.query.skip ? Number(request.query.skip) : 0;
  const users = await prismaClient.user.findMany({
    skip,
    take: 5
  });
  response.json({
    data: users
  });
}

export const getUserById = async (request: Request, response: Response) => {
  const user = await prismaClient.user.findFirst({
    where: {
      id:
        +request.params.id
    },
    include: {
      addresses: true
    }
  })
  if (!user) {
    throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND)
  }
  response.json({
    data: user
  });
}

export const changeUserRole = async (request: Request, response: Response) => {
  RoleSchema.parse(request.body);

  const user = await prismaClient.user.update({
    where: {
      id:
        +request.params.id
    },
    data: {
      role: request.body.role
    }
  })
  if (!user) {
    throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND)
  }
  response.json({
    data: user
  });
}