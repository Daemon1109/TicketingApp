import express from 'express';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  (req: express.Request, res: express.Response) => {
    res.send('Hi from currentuser.ts');
  }
);

export { router as currentuserRouter };
