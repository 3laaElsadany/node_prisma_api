import express, { Router } from 'express';
import authRoute from './auth';
import productRoute from './product';
import userRoute from './user';
import cartRoute from './cart';
import orderRoute from './order';
const router: Router = express.Router();

router.use('/auth', authRoute);
router.use('/products', productRoute);
router.use('/users', userRoute);
router.use('/carts', cartRoute);
router.use('/orders', orderRoute);


export default router;