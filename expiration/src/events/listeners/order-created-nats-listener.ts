import { Message } from 'node-nats-streaming';

import {
  NATSListener,
  Subjects,
  OrderCreatedEvent,
} from '@daemonticketing/common';

import { queueGroupName } from './values';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedNATSListener extends NATSListener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay,
      }
    );

    msg.ack();
  }
}
