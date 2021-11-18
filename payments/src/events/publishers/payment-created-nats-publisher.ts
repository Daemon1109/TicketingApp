import {
  NATSPublisher,
  Subjects,
  PaymentCreatedEvent,
} from '@daemonticketing/common';

export class PaymentCreatedNATSPublisher extends NATSPublisher<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
