import { Message } from 'node-nats-streaming';

import {
  Subjects,
  NATSListener,
  TicketCreatedEvent,
} from '@daemonticketing/common';

import { queueGroupName } from './values';
import { Ticket } from '../../models/Ticket';

export class TicketCreatedNATSListener extends NATSListener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
