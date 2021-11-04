import express from 'express';

const router = express.Router();

router.post(
  '/api/users/signout',
  (req: express.Request, res: express.Response) => {
    res.send('Hi from signout');
  }
);

export { router as signoutRouter };
