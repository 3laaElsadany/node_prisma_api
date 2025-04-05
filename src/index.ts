import express from 'express';
const app = express();

require('dotenv').config({
  path: `${process.cwd()}/.env`
});

import { PrismaClient } from '@prisma/client';
import router from './routes';
import { errorMiddleware } from './middlewares/errors';

export const prismaClient = new PrismaClient().$extends({
  result: {
    address: {
      formatedAddress: {
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pincode: true
        },
        compute: (address) => {
          return `${address.lineOne}, ${address.lineTwo}, ${address.city}, ${address.country}, ${address.pincode}`
        }
      }
    }
  }
})

app.use(express.json());

app.use('/api', router);

app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server is running on port 3000');
});