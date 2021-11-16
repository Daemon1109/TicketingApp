import { Message } from 'node-nats-streaming';

import {
  NATSListener,
  OrderCreatedEvent,
  Subjects,
} from '@daemonticketing/common';

import { queueGroupName } from './values';
import { Ticket } from '../../models/Ticket';
import { TicketUpdatedNATSPublisher } from '../publishers/ticket-updated-nats-publisher';

export class OrderCreatedNATSListener extends NATSListener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find ticket to be reserved by order
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw an error
    if (!ticket) {
      throw new Error('Ticket Not Found');
    }

    // Mark the ticket as reserved by setting orderId
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();

    // Publish ticket updated event
    await new TicketUpdatedNATSPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: data.id,
    });

    // acknowledge the message
    msg.ack();
  }
}
