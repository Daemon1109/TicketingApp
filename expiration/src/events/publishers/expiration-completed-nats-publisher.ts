import {
  Subjects,
  NATSPublisher,
  ExpirationCompletedEvent,
} from '@daemonticketing/common';

export class ExpirationCompletedNATSPublisher extends NATSPublisher<ExpirationCompletedEvent> {
  readonly subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}
