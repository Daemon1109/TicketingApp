import mongoose from 'mongoose';
import { Order, OrderStatus } from './Order';

// An interface to define the properties that are required to create a new Ticket
interface TicketAttrs {
  title: string;
  price: number;
}

// An interface to define the properties of a Ticket Document
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

// An interface to define the properties of a Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(ticketAttrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (ticketAttrs: TicketAttrs) => {
  return new Ticket(ticketAttrs);
};

ticketSchema.methods.isReserved = async function () {
  // Run query to look at all order. Find an order where the ticket
  // is the ticket we just found *AND* the order's status is *NOT* cancelled.
  // If found, means ticket *IS* already reserved
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
