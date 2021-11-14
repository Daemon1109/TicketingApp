import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  validateRequest,
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@daemonticketing/common';

import { Ticket } from '../models/Ticket';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedNATSPublisher } from '../events/publishers/ticket-updated-nats-publisher';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    await new TicketUpdatedNATSPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
