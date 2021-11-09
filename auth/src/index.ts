import mongoose from 'mongoose';

import { app } from './app';

const PORT = process.env.PORT || 3000;

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined in environment');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined in environment');
  }

  try {
    const mongoURI = process.env.MONGO_URI;
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
