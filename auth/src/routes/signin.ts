import express from 'express';

const router = express.Router();

router.post(
  '/api/users/signin',
  (req: express.Request, res: express.Response) => {
    res.send('Hi from signin.ts');
  }
);

export { router as signinRouter };
