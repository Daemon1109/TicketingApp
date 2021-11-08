import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError, validateRequest } from '@daemonticketing/common';
import { User } from '../models/User';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Please provide a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Extract information from request body
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    // If no, throw a BadRequestError
    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }

    // Compare stored and provided passwords
    const passwordMatches = await Password.compare(
      existingUser.password,
      password
    );

    // If passwords don't match, throw a BadRequestError
    if (!passwordMatches) {
      throw new BadRequestError('Invalid Credentials');
    }

    // Generate a JWT for user
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store the JWT in session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
