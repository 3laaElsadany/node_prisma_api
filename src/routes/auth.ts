import express, { Router } from 'express';
import { currentUser, login, signup } from '../controllers/auth';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
const authRoute: Router = express.Router();


authRoute.post("/signup", errorHandler(signup));
authRoute.post("/login", errorHandler(login));
authRoute.get('/currentUser', [authMiddleware], errorHandler(currentUser));

export default authRoute;