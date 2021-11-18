import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { OrderCreatedEvent, OrderStatus } from '@daemonticketing/common';

import { OrderCreatedNATSListener } from '../order-created-nats-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/Order';

const setup = async () => {
  const listener = new OrderCreatedNATSListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'saddq1dq1d',
    status: OrderStatus.Created,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 10.0,
    },
    userId: 'adqwdqwdq',
    version: 0,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
