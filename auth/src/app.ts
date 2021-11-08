import express, { json } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentuserRouter } from './routes/currentuser';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@daemonticketing/common';

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

// Use API routers
app.use(currentuserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler); // Custom error handler

export { app }; // Export the express app
