import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/User';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 30 })
      .withMessage('Password must be between 6 & 30 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Extract information from request body
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    // If yes, throw a BadRequestError
    if (existingUser) {
      throw new BadRequestError('Provided Email is already in use');
    }

    // If no, save the details in database
    const user = User.build({ email, password });
    await user.save();

    // Generate a JWT for user
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store the JWT in session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
