import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { getCookie } from '../../test/setup';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/Ticket';

it('returns 404 if provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', getCookie())
    .send({
      title: 'New Test Title',
      price: 20.0,
    })
    .expect(404);
});

it('returns 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'New Test Title',
      price: 20.0,
    })
    .expect(401);
});

it("returns 401 if user doesn't own the ticket", async () => {
  const oldTitle = 'Test Title';
  const oldPrice = 10.0;

  const newTitle = 'New Test Title';
  const newPrice = 20.0;

  const oldTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({
      title: oldTitle,
      price: oldPrice,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${oldTicket.body.id}`)
    .set('Cookie', getCookie())
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(401);

  // Check if really no changes were not made
  const newTicket = await request(app)
    .get(`/api/tickets/${oldTicket.body.id}`)
    .send();

  expect(newTicket.body.title).not.toEqual(newTitle);
  expect(newTicket.body.price).not.toEqual(newPrice);
});

it('returns 400 if provided title is invalid', async () => {
  const cookie = getCookie();

  const newTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Title',
      price: 10.0,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20.0,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      price: 20.0,
    })
    .expect(400);
});

it('returns 400 if provided price is invalid', async () => {
  const cookie = getCookie();

  const newTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Title',
      price: 10.0,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Test Title',
      price: -20.0,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${newTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Test Title',
    })
    .expect(400);
});

it('returns 200 & updates the ticket if provided inputs are valid', async () => {
  const cookie = getCookie();

  const oldTitle = 'Test Title';
  const oldPrice = 10.0;

  const newTitle = 'New Test Title';
  const newPrice = 20.0;

  const oldTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: oldTitle,
      price: oldPrice,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${oldTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(200);

  const newTicket = await request(app)
    .get(`/api/tickets/${oldTicket.body.id}`)
    .send();

  // Check if really changes were made
  expect(newTicket.body.title).toEqual(newTitle);
  expect(newTicket.body.price).toEqual(newPrice);
});

it('publishes a ticket:updated event', async () => {
  const cookie = getCookie();

  const oldTitle = 'Test Title';
  const oldPrice = 10.0;

  const newTitle = 'New Test Title';
  const newPrice = 20.0;

  const oldTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: oldTitle,
      price: oldPrice,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${oldTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects update if ticket is reserved', async () => {
  const cookie = getCookie();

  const oldTitle = 'Test Title';
  const oldPrice = 10.0;

  const newTitle = 'New Test Title';
  const newPrice = 20.0;

  const oldTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: oldTitle,
      price: oldPrice,
    })
    .expect(201);

  const ticket = await Ticket.findById(oldTicket.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${oldTicket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(400);
});
