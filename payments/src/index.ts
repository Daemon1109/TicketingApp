import mongoose from 'mongoose';

import { app } from './app';
import { OrderCancelledNATSListener } from './events/listeners/order-cancelled-nats-listener';
import { OrderCreatedNATSListener } from './events/listeners/order-created-nats-listener';
import { natsWrapper } from './nats-wrapper';

const PORT = process.env.PORT || 3000;

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined in environment');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined in environment');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined in environment');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined in environment');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined in environment');
  }
  if (!process.env.STRIPE_KEY) {
    throw new Error('STRIPE_KEY must be defined in environment');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedNATSListener(natsWrapper.client).listen();
    new OrderCancelledNATSListener(natsWrapper.client).listen();

    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Ticketing payments service listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Cannot connect to MongoDB');
    console.error(err);
  }
};

startUp();
