import request from 'supertest';
import { app } from '../../app';

let signupUri = '/api/users/signup';
let signinUri = '/api/users/signin';

it("returns 400 on email that doesn't exist", async () => {
  return request(app)
    .post(signinUri)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('returns 400 on invalid password', async () => {
  await request(app)
    .post(signupUri)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post(signinUri)
    .send({
      email: 'test@test.com',
      password: 'invalidpassword',
    })
    .expect(400);
});

it('sends a cookie on successful signin', async () => {
  await request(app)
    .post(signupUri)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post(signinUri)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
