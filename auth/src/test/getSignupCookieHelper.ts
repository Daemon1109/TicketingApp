import request from 'supertest';
import { app } from '../app';

export const getSignupCookie = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const signupUri = '/api/users/signup';

  const response = await request(app)
    .post(signupUri)
    .send({
      email,
      password,
    })
    .expect(201);

  return response.get('Set-Cookie');
};
