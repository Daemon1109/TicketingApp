interface Ticket {
  id: string;
  title: string;
  price: number;
  userId?: string;
  orderId?: string;
  version: number;
}

export type { Ticket };
