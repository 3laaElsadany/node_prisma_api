import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/bad-request";

export const addItemToCart = async (request: Request, response: Response) => {
  const validateData = CreateCartSchema.parse(request.body);
  let product = await prismaClient.product.findFirst({
    where: {
      id: validateData.productId
    }
  });

  if (!product) {
    throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
  }

  const cartExist = await prismaClient.cartItem.findFirst({
    where: {
      userId: request.user.id,
      productId: validateData.productId
    }
  })

  if (!cartExist) {
    const cart = await prismaClient.cartItem.create({
      data: {
        userId: request.user.id,
        productId: product.id,
        quantity: validateData.quantity
      }
    })
    return response.json({
      data: cart
    })
  } else {
    const newQuantity = cartExist.quantity + request.body.quantity;
    await prismaClient.cartItem.update({
      where: {
        id: cartExist.id
      },
      data: {
        quantity: newQuantity
      }
    })
    return response.json({
      data: { ...cartExist, quantity: cartExist.quantity + 2 }
    })
  }
}


export const deleteItemFromCart = async (request: Request, response: Response) => {
  const cart = await prismaClient.cartItem.findFirst({
    where: {
      id: +request.params.id
    }
  })
  if (!cart) {
    throw new NotFoundException("Cart not found", ErrorCode.CART_NOT_FOUND);
  }
  if (cart.userId == request.user.id) {
    await prismaClient.cartItem.delete({
      where: {
        id: +request.params.id
      }
    });
    response.json({
      success: true
    })
  } else {
    throw new BadRequestException("You can't delete other user's cart item", ErrorCode.CART_DOES_NOT_BELONG);
  }
}

export const changeQuantity = async (request: Request, response: Response) => {
  const validateData = ChangeQuantitySchema.parse(request.body);
  const cart = await prismaClient.cartItem.findFirst({
    where: {
      id: +request.params.id
    }
  })
  if (!cart) {
    throw new NotFoundException("Cart not found", ErrorCode.CART_NOT_FOUND);
  }

  if (cart.userId == request.user.id) {

    const updateCart = await prismaClient.cartItem.update({
      where: {
        id: +request.params.id
      },
      data: {
        quantity: validateData.quantity
      }
    });

    response.json({
      data: updateCart
    })
  } else {
    throw new BadRequestException("You can't change in other user's cart item", ErrorCode.CART_DOES_NOT_BELONG);
  }
}

export const getCart = async (request: Request, response: Response) => {
  const carts = await prismaClient.cartItem.findMany({
    where: {
      userId: request.user.id
    },
    include: {
      product: true
    }
  });
  response.json({
    count: carts.length,
    data: carts
  })
}