import { Request, Response } from 'express';
import { compareSync, hashSync } from 'bcrypt';
import { prismaClient } from '../app.config';
import * as jwt from 'jsonwebtoken';

const SignUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please, provide a username and password.' });
    }

    let user = await prismaClient.user.findFirst({
      where: { email }
    });

    if (user) {
      return res.status(409).json({ message: 'User already exists!' });
    }

    user = await prismaClient.user.create({
      data: {
        email,
        password: hashSync(password, 10)
      }
    });

    delete user.password;

    res.json(user);
  } catch (err) {
    console.error(err);
  }
};

const Login = async (req, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please, provide a username and password.' });
    }

    let user = await prismaClient.user.findFirst({
      where: { email }
    });

    if (!user) {
      return res.status(409).json({ message: 'User does not exists!' });
    }

    if (!compareSync(password, user.password)) {
      return res.status(400).json({ message: 'Incorrect credentials!' });
    }

    const token = jwt.sign(
      {
        userId: user.id
      },
      process.env.JWT_SECRET
    );

    delete user.password;

    res.json({ user, token });
  } catch (err) {
    console.error(err);
  }
};

export const AuthRoutes = {
  SignUp,
  Login
};
