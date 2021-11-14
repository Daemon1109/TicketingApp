import {
  NATSPublisher,
  Subjects,
  TicketCreatedEvent,
} from '@daemonticketing/common';

export class TicketCreatedNATSPublisher extends NATSPublisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
