import request from 'supertest';
import { app } from '../../app';

let signup_uri = '/api/users/signup';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post(signup_uri)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('returns a 400 with invalid email', async () => {
  return request(app)
    .post(signup_uri)
    .send({
      email: 'sadasdas',
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 with invalid password', async () => {
  return request(app)
    .post(signup_uri)
    .send({
      email: 'test@test.com',
      password: 'pas',
    })
    .expect(400);
});

it('returns a 400 with missing email', async () => {
  return request(app)
    .post(signup_uri)
    .send({
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 with missing password', async () => {
  return request(app)
    .post(signup_uri)
    .send({
      email: 'test@test.com',
    })
    .expect(400);
});

it('returns a 400 with missing email & passwword', async () => {
  return request(app).post(signup_uri).send({}).expect(400);
});

it('disallows duplicate users', async () => {
  await request(app)
    .post(signup_uri)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post(signup_uri)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('sends a cookie on successful signup', async () => {
  const response = await request(app)
    .post(signup_uri)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
