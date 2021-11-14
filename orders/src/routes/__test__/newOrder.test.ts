import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/Order';
import { Ticket } from '../../models/Ticket';
import { getCookie } from '../../test/setup';

it('returns an error if ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookie())
    .send({
      ticketId,
    })
    .expect(404);
});

it('returns an error if ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'Test Title',
    price: 10.0,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'naabkcjba',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'Test Title',
    price: 10.0,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it.todo('emits an event for created order');
