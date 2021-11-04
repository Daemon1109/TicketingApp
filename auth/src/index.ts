import express, { json } from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentuserRouter } from './routes/currentuser';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

// Configuring express to trust the proxy connections
app.set('trust proxy', true);

const PORT = process.env.PORT || 3000;

// Use API routers
app.use(currentuserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', () => {
  throw new NotFoundError();
});

// Use middlewares
app.use(errorHandler); // Custom error handler
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
); // Middleware for handling cookies

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined in environment');
  }

  try {
    // await mongoose.connect('mongodb://localhost:27017/ticketing-auth');
    const mongoURI =
      'mongodb://auth-mongo-srv:27017/TicketingApp?retryWrites=true&w=majority';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Ticketing auth service listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Cannot connect to MongoDB');
    console.error(err);
  }
};

startUp();
