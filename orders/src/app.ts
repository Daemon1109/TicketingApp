import express, { json } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import {
  currentUser,
  errorHandler,
  NotFoundError,
} from '@daemonticketing/common';

import { newOrderRouter } from './routes/newOrder';
import { getOrderRouter } from './routes/getOrder';
import { getAllOrdersRouter } from './routes/getAllOrders';
import { deleteOrderRouter } from './routes/deleteOrder';

const app = express();
app.use(json());

// Configuring express to trust the proxy connections
app.set('trust proxy', true);

// Use middlewares
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
); // Middleware for handling cookies

app.use(currentUser); // Middleware to add current user details on request

// Use API routers
app.use(newOrderRouter);
app.use(getOrderRouter);
app.use(getAllOrdersRouter);
app.use(deleteOrderRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler); // Custom error handler

export { app }; // Export the express app
