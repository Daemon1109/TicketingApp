import { Message } from 'node-nats-streaming';

import {
  NATSListener,
  Subjects,
  PaymentCreatedEvent,
  OrderStatus,
} from '@daemonticketing/common';

import { queueGroupName } from './values';
import { Order } from '../../models/Order';

export class PaymentCreatedNATSListener extends NATSListener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order Not Found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
