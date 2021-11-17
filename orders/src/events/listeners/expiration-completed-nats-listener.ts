import { Message } from 'node-nats-streaming';

import {
  Subjects,
  NATSListener,
  ExpirationCompletedEvent,
  OrderStatus,
} from '@daemonticketing/common';

import { queueGroupName } from './values';
import { Order } from '../../models/Order';
import { OrderCancelledNATSPublisher } from '../publishers/order-cancelled-nats-publisher';

export class ExpirationCompletedNATSListener extends NATSListener<ExpirationCompletedEvent> {
  readonly subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompletedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Not Found');
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelledNATSPublisher(this.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    msg.ack();
  }
}
