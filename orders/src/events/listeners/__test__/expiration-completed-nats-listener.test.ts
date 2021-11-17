import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { OrderStatus, ExpirationCompletedEvent } from '@daemonticketing/common';

import { Order } from '../../../models/Order';
import { Ticket } from '../../../models/Ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompletedNATSListener } from '../expiration-completed-nats-listener';

const setup = async () => {
  const listener = new ExpirationCompletedNATSListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test Title',
    price: 10.0,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'sadwdqwdqwd',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket, order };
};

it('updates order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
