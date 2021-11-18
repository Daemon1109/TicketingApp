import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface to define the properties that are required to create a new Payment
interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

// An interface to define the properties of a Payment Document
interface PaymentDoc extends mongoose.Document {
  version: number;
  stripeId: string;
  orderId: string;
}

// An interface to define the properties of a Payment Model
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(ticketAttrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
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

paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
