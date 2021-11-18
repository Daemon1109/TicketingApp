import express, { json } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import {
  currentUser,
  errorHandler,
  NotFoundError,
} from '@daemonticketing/common';

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

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler); // Custom error handler

export { app }; // Export the express app
