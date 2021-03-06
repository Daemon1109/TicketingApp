import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedNATSListener } from './events/listeners/ticket-created-nats-listener';
import { TicketUpdatedNATSListener } from './events/listeners/ticket-updated-nats-listener';
import { ExpirationCompletedNATSListener } from './events/listeners/expiration-completed-nats-listener';
import { PaymentCreatedNATSListener } from './events/listeners/payment-creates-nats-listener';

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

    new TicketCreatedNATSListener(natsWrapper.client).listen();
    new TicketUpdatedNATSListener(natsWrapper.client).listen();

    new ExpirationCompletedNATSListener(natsWrapper.client).listen();

    new PaymentCreatedNATSListener(natsWrapper.client).listen();

    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Ticketing orders service listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Cannot connect to MongoDB');
    console.error(err);
  }
};

startUp();
