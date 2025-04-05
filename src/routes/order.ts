import express, { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import { cancelOrder, changeStatus, createOrder, getOrderById, listAllOders, listOrders, listUserOders } from '../controllers/order';
import adminMiddleware from '../middlewares/admin';

const orderRoute: Router = express.Router();

orderRoute.post('/', [authMiddleware], errorHandler(createOrder));
orderRoute.get('/', [authMiddleware], errorHandler(listOrders));
orderRoute.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder));
orderRoute.get('/index', [authMiddleware, adminMiddleware], errorHandler(listAllOders));
orderRoute.get('/:id', [authMiddleware], errorHandler(getOrderById));
orderRoute.get('/users/:id', [authMiddleware, adminMiddleware], errorHandler(listUserOders));
orderRoute.put('/:id/status', [authMiddleware, adminMiddleware], errorHandler(changeStatus));

export default orderRoute;