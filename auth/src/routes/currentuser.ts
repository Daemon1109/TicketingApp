import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  (req: express.Request, res: express.Response) => {
    if (!req.session?.jwt) {
      res.send({ currentUser: null });
    }

    try {
      const payload = jwt.verify(req.session?.jwt, process.env.JWT_KEY!);
      res.send({ currentUser: payload });
    } catch (error) {
      res.send({ currentUser: null });
    }
  }
);

export { router as currentuserRouter };
