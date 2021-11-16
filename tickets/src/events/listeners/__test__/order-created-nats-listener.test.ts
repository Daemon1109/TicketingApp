import mongoose from 'mongoose';

import { OrderCreatedEvent, OrderStatus } from '@daemonticketing/common';

import { Ticket } from '../../../models/Ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedNATSListener } from '../order-created-nats-listener';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // Create a listener
  const listener = new OrderCreatedNATSListener(natsWrapper.client);

  // Create & save a ticket
  const ticket = Ticket.build({
    title: 'Test Title',
    price: 10.0,
    userId: 'saecwcwefcwed',
  });
  await ticket.save();

  // Create a fake event data
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'saccwecwe',
    expiresAt: 'accwecwe',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // Create a fake msg
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // Return everything
  return { listener, ticket, data, msg };
};

it('sets userId of ticket', async () => {
  const { ticket, listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { ticket, listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  await Ticket.findById(ticket.id);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket update event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const updatedTicketData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(updatedTicketData.orderId).toEqual(data.id);
});
