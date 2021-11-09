import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { getCookie } from '../../test/setup';

it('returns 404 if ticket not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns ticket details if ticket exists', async () => {
  // Random ticket details
  const title = 'Test Title';
  const price = 10.0;

  // Create a new ticket
  const newTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({
      title,
      price,
    })
    .expect(201);

  // Get details of created ticket
  const response = await request(app)
    .get(`/api/tickets/${newTicket.body.id}`)
    .send()
    .expect(200);

  // Check if returned & actual data are same
  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
});
