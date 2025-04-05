import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createProduct = async (request: Request, response: Response) => {
  const product = await prismaClient.product.create({
    data: {
      ...request.body,
      tags: request.body.tags.join(',')
    }
  })

  response.json({
    data: product
  })
}

export const updateProduct = async (request: Request, response: Response) => {
  try {
    const product = request.body;
    if (product.tags && Array.isArray(product.tags)) {
      product.tags = product.tags.join(',')
    }
    const id = parseInt(request.params.id);

    const updateProduct = await prismaClient.product.update({
      where: { id },
      data: product
    })
    return response.status(200).json({ data: updateProduct });
  } catch (error) {
    throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
  }
}

export const deleteProduct = async (request: Request, response: Response) => {
  try {
    const id = parseInt(request.params.id);
    const product = await prismaClient.product.delete({
      where: { id }
    })
    response.json({ success: true });
  } catch (error) {
    throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
  }
}

export const listProduct = async (request: Request, response: Response) => {
  const count = await prismaClient.product.count();
  const skip = parseInt(request.query.skip as string) || 0;
  const products = await prismaClient.product.findMany({
    skip,
    take: 5
  })

  response.json({
    count,
    data: products
  })
}


export const getProductById = async (request: Request, response: Response) => {

  const id = parseInt(request.params.id);
  const product = await prismaClient.product.findFirst({
    where: {
      id
    }
  })

  if (!product) {
    throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
  }

  response.json({ data: product });
}

export const searchProducts = async (request: Request, response: Response) => {
  const searchQuery = request.query.q as string;
  const page = Number(request.query.page) || 1;
  const pageSize = Number(request.query.pageSize) || 10;

  const products = await prismaClient.product.findMany({
    where: {
      OR: [
        { name: { contains: searchQuery } },
        { description: { contains: searchQuery } },
        { tags: { contains: searchQuery } }
      ]
    },
    skip: (page - 1) * pageSize,
    take: pageSize
  });

  const totalProducts = await prismaClient.product.count({
    where: {
      OR: [
        { name: { contains: searchQuery } },
        { description: { contains: searchQuery } },
        { tags: { contains: searchQuery } }
      ]
    }
  });

  response.json({
    meta: {
      totalProducts,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: page,
      pageSize
    },
    data: products
  });
};
