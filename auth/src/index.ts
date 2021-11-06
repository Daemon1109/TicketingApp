import mongoose from 'mongoose';

import { app } from './app';

const PORT = process.env.PORT || 3000;

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
