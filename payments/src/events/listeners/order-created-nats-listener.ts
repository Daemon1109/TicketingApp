import { Message } from 'node-nats-streaming';

import {
  NATSListener,
  Subjects,
  OrderCreatedEvent,
} from '@daemonticketing/common';

import { queueGroupName } from './values';
import { Order } from '../../models/Order';

export class OrderCreatedNATSListener extends NATSListener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
