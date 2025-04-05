import express, { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from '../controllers/cart';

const cartRoute: Router = express.Router();

cartRoute.post('/', [authMiddleware], errorHandler(addItemToCart));
cartRoute.get('/', [authMiddleware], errorHandler(getCart));
cartRoute.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart));
cartRoute.put('/:id', [authMiddleware], errorHandler(changeQuantity));

export default cartRoute;