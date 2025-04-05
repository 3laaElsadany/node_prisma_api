import express, { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';
import { addAddress, changeUserRole, deleteAddress, getUserById, listAddress, listUsers, updateUser } from '../controllers/user';

const userRoute: Router = express.Router();

userRoute.post('/address', [authMiddleware], errorHandler(addAddress));
userRoute.get('/address', [authMiddleware], errorHandler(listAddress));
userRoute.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
userRoute.put('/', [authMiddleware], errorHandler(updateUser));
userRoute.put('/:id/role', [authMiddleware, adminMiddleware], errorHandler(changeUserRole));
userRoute.get('/', [authMiddleware, adminMiddleware], errorHandler(listUsers));
userRoute.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getUserById));

export default userRoute;