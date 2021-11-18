import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@daemonticketing/common';
import { Order } from '../models/Order';
import { Payment } from '../models/Payment';
import { stripe } from '../stripe';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty()
      .withMessage('Please provide a valid Stripe token'),
    body('orderId')
      .not()
      .isEmpty()
      .custom((input) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Please provide a valid orderId'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    const stripeCharge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'INR',
      source: token,
      description: `Payment created for order ${orderId}`,
    });

    const payment = Payment.build({
      stripeId: stripeCharge.id,
      orderId,
    });
    await payment.save();

    res.status(201).send({ success: true });
  }
);

export { router as newPaymentRouter };
