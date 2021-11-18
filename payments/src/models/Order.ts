import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { OrderStatus } from '@daemonticketing/common';

// An interface to define the properties that are required to create a new Order
interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

// An interface to define the properties of a Order Document
interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

// An interface to define the properties of a Order Model
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(ticketAttrs: OrderAttrs): OrderDoc;
  // Helper function for event listeners to get the document
  // only if the version of current data is +1 to old data version
  // If found, i.e. event is in order so proceed with functionality
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
      required: true,
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
