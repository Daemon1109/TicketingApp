import request from 'supertest';

import { app } from '../../app';
import { getCookie } from '../../test/setup';

const createTicket = () => {
  return request(app).post('/api/tickets').set('Cookie', getCookie()).send({
    title: 'Test Title',
    price: 10.0,
  });
};

it('returns list of all tickets', async () => {
  // Initially 0 tickets should be present
  let tickets = await request(app).get('/api/tickets').send().expect(200);
  expect(tickets.body.length).toEqual(0);

  // Add 3 tickets to collection
  await createTicket();
  await createTicket();
  await createTicket();

  // Get all tickets
  tickets = await request(app).get('/api/tickets').send().expect(200);

  // Check if all tickets are returned
  expect(tickets.body.length).toEqual(3);
});
