import { Message } from 'node-nats-streaming';

import {
  Subjects,
  NATSListener,
  TicketUpdatedEvent,
} from '@daemonticketing/common';

import { queueGroupName } from './values';
import { Ticket } from '../../models/Ticket';

export class TicketUpdatedNATSListener extends NATSListener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket Not Found');
    }

    const { title, price } = data;

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
