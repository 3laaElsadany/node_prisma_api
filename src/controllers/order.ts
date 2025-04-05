import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { StatusSchema } from "../schema/users";


export const createOrder = async (request: Request, response: Response) => {
  return await prismaClient.$transaction(async (prisma) => {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: request.user.id },
      include: {
        product: true
      }
    });
    if (cartItems.length == 0) {
      return response.json({ message: "cart is empty" })
    }
    const price = cartItems.reduce((prev, current) => {
      return prev + (current.quantity * +current.product.price)
    }, 0)
    const address = await prisma.address.findFirst({
      where: {
        id: request.user.defaultShippingAddress
      }
    });
    const order = await prisma.order.create({
      data: {
        userId: request.user.id,
        netAmount: price,
        address: address?.formatedAddress ?? "",
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity
            }
          })
        }
      }
    });
    const orderEvent = await prisma.orderEvents.create({
      data: {
        orderId: order.id,
      }
    });

    await prisma.cartItem.deleteMany({
      where: {
        userId: request.user.id
      }
    });
    response.json({
      data: order
    });
  })
}

export const listOrders = async (request: Request, response: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: request.user.id
    }
  });
  response.json({
    data: orders
  })
}


export const cancelOrder = async (request: Request, response: Response) => {
  const order = await prismaClient.order.update({
    where: {
      id: +request.params.id
    },
    data: {
      status: "CANCELED"
    }
  });
  if (!order) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND)
  }
  await prismaClient.orderEvents.create({
    data: {
      orderId: order.id,
      status: "CANCELED"
    }
  })
  response.json({
    data: order
  })
}

export const getOrderById = async (request: Request, response: Response) => {
  const order = await prismaClient.order.findFirst({
    where: {
      id: +request.params.id
    },
    include: {
      products: true,
      events: true
    }
  });
  if (!order) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND)
  }
  response.json({
    data: order
  })
}

export const listAllOders = async (request: Request, response: Response) => {
  let whereClause = {};
  const status = request.query.status;
  if (status) {
    whereClause = { status: status };
  }
  const skip = request.query.skip ? Number(request.query.skip) : 0;
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip,
    take: 5
  });
  response.json({
    data: orders
  });
}

export const changeStatus = async (request: Request, response: Response) => {
  StatusSchema.parse(request.body);
  const order = await prismaClient.order.update({
    where: {
      id: +request.params.id
    },
    data: {
      status: request.body.status
    }
  });
  if (!order) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND)
  }
  await prismaClient.orderEvents.create({
    data: {
      orderId: order.id,
      status: request.body.status,
    }
  });
  response.json({
    data: order
  })
}


export const listUserOders = async (request: Request, response: Response) => {
  let whereClause: any = {
    userId: +request.params.id
  };
  const status = request.query.status;
  if (status) {
    whereClause = {
      ...whereClause,
      status: status
    };
  }
  const skip = request.query.skip ? Number(request.query.skip) : 0;
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip,
    take: 5
  });
  response.json({
    data: orders
  });
}
