import {
  NATSPublisher,
  OrderCreatedEvent,
  Subjects,
} from '@daemonticketing/common';

export class OrderCreatedNATSPublisher extends NATSPublisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
