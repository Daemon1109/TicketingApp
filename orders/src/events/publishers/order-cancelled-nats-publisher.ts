import {
  NATSPublisher,
  OrderCancelledEvent,
  Subjects,
} from '@daemonticketing/common';

export class OrderCancelledNATSPublisher extends NATSPublisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
