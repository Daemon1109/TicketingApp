import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { TicketUpdatedEvent } from '@daemonticketing/common';

import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedNATSListener } from '../ticket-updated-nats-listener';
import { Ticket } from '../../../models/Ticket';

const setup = async () => {
  // Create a fake listener
  const listener = new TicketUpdatedNATSListener(natsWrapper.client);

  // Create & save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test Title',
    price: 10.0,
  });

  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'New Title',
    price: 20.0,
    userId: 'sacecwecewcew',
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return everything
  return { listener, data, ticket, msg };
};

it('finds, updates & saves a ticket', async () => {
  // setup
  const { listener, data, ticket, msg } = await setup();

  // call onMessage with fake data & msg
  await listener.onMessage(data, msg);

  // Assertions to check if ticket was updated
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks a message', async () => {
  // setup
  const { listener, data, msg } = await setup();

  // call onMessage with fake data & msg
  await listener.onMessage(data, msg);

  // Assertions to check if message was acknowledged
  expect(msg.ack).toHaveBeenCalled();
});

it('does not ack message if version of data is not in order', async () => {
  // setup
  const { listener, data, msg } = await setup();

  // change version of data
  data.version = 100;

  // call onMessage with fake data & msg
  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  // Assertions to check if message was not acknowledged
  expect(msg.ack).not.toHaveBeenCalled();
});
