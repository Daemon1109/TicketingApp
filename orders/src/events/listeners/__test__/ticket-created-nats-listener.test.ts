import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { TicketCreatedEvent } from '@daemonticketing/common';

import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedNATSListener } from '../ticket-created-nats-listener';
import { Ticket } from '../../../models/Ticket';

const setup = async () => {
  // Create an instance of listener
  const listener = new TicketCreatedNATSListener(natsWrapper.client);

  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test Title',
    price: 10.0,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return everything
  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  // setup
  const { listener, data, msg } = await setup();
  // call the onMessage function with fake data & message objects
  await listener.onMessage(data, msg);

  // Assertions to make sure ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks a message', async () => {
  // setup
  const { listener, data, msg } = await setup();

  // call the onMessage function with fake data & message objects
  await listener.onMessage(data, msg);

  // Assertions to make sure event was acknowledged
  expect(msg.ack).toHaveBeenCalled();
});
