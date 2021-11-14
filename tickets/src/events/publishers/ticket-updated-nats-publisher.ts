import {
  NATSPublisher,
  Subjects,
  TicketUpdatedEvent,
} from '@daemonticketing/common';

export class TicketUpdatedNATSPublisher extends NATSPublisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
