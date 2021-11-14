import express, { Request, Response } from 'express';

const router = express.Router();

router.delete('/api/orders/:id', async (req: Request, res: Response) => {});

export { router as deleteOrderRouter };
