import { Message } from 'node-nats-streaming';

import {
  OrderCancelledEvent,
  NATSListener,
  Subjects,
  OrderStatus,
} from '@daemonticketing/common';

import { queueGroupName } from './values';
import { Order } from '../../models/Order';

export class OrderCancelledNATSListener extends NATSListener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByEvent(data);

    if (!order) {
      throw new Error('Order Not Found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
