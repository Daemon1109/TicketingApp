import request from 'supertest';
import { app } from '../../app';

let signupUri = '/api/users/signup';
let signoutUri = '/api/users/signout';

it('clears the cookie on successful signout', async () => {
  await request(app)
    .post(signupUri)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app).post(signoutUri).send({}).expect(200);

  expect(response.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
