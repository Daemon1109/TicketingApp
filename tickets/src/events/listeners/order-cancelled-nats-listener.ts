import { Message } from 'node-nats-streaming';

import {
  NATSListener,
  OrderCancelledEvent,
  Subjects,
} from '@daemonticketing/common';

import { queueGroupName } from './values';
import { Ticket } from '../../models/Ticket';
import { TicketUpdatedNATSPublisher } from '../publishers/ticket-updated-nats-publisher';

export class OrderCancelledNATSListener extends NATSListener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket Not Found');
    }

    ticket.set({ orderId: undefined });

    await ticket.save();

    await new TicketUpdatedNATSPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      orderId: ticket.orderId,
      userId: ticket.userId,
      version: ticket.version,
    });

    msg.ack();
  }
}
