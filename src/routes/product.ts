import express from 'express';
import { errorHandler } from '../error-handler';
import { createProduct, deleteProduct, getProductById, listProduct, searchProducts, updateProduct } from '../controllers/product';
import authMiddleware from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';
const productRoute = express.Router();


productRoute.get('/', [authMiddleware, adminMiddleware], errorHandler(listProduct));
productRoute.post('/', [authMiddleware, adminMiddleware], errorHandler(createProduct));
productRoute.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct));
productRoute.get('/search', [authMiddleware], errorHandler(searchProducts));
productRoute.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getProductById));
productRoute.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct));

export default productRoute;