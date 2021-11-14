import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';

import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@daemonticketing/common';
import { Order, OrderStatus } from '../models/Order';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  [
    param('orderId')
      .exists()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Provide a valid orderId as a request paramter'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
