import request from 'supertest';
import { app } from '../../app';

import { getSignupCookie } from '../../test/getSignupCookieHelper';

let currentuserUri = '/api/users/currentuser';

it('returns details of current user', async () => {
  const cookie = await getSignupCookie();

  const response = await request(app)
    .get(currentuserUri)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('returns 200 with null if not authenticated', async () => {
  const response = await request(app).get(currentuserUri).send({}).expect(200);

  expect(response.body.currentUser).toEqual(null);
});
