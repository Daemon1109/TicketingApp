import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';

import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@daemonticketing/common';
import { Order } from '../models/Order';

const router = express.Router();

router.get(
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
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as getOrderRouter };
