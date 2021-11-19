import { Ticket } from './Ticket';

interface Order {
  id: string;
  status: string;
  version: number;
  expiresAt: string;
  userId: string;
  ticket: Ticket;
}

export type { Order };
