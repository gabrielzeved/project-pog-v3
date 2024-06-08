import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { prismaClient } from '../app.config';
import { User } from '@prisma/client';

interface IUserRequest extends Request {
  user: User;
}

const authMiddleware = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ message: 'Not authenticated' });
    }

    const payload = jwt.verify(token!, process.env.JWT_SECRET!) as any;

    const user = await prismaClient.user.findFirst({
      where: {
        id: payload.userId
      }
    });

    if (!user) {
      return res.status(401).send({ message: 'Not authenticated' });
    }

    delete user.password;

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({ message: 'Not authenticated' });
  }
};

export default authMiddleware;
