import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models/Ticket';
import { getCookie } from '../../test/setup';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns code other than 401 if user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid ticket title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid ticket price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({
      title: 'Test Title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({
      title: 'Test Title',
    })
    .expect(400);
});

it('creates a ticket for given valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0); // There should be 0 tickets at start

  const title = 'Test Title';
  const price = 10.0;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({
      title,
      price,
    })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1); // Ticket collection should have 1 ticket

  // Check if correct details wetr stored
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});
