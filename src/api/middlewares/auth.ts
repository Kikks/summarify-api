import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET_KEY } from '../lib/constants';
import { failure } from '../lib/response';

const checkUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];

    try {
      const user = jwt.verify(token, JWT_SECRET_KEY as string) as any;

      if (!user) return failure({ message: 'Invalid/Expired Token.', httpCode: 403, res });

      res.locals.user = user;
      return next();
    } catch (error) {
      return failure({
        message: 'Invalid/Expired Token.',
        httpCode: 403,
        res,
      });
    }
  } else {
    return failure({
      message: 'Authentication header must be provided.',
      httpCode: 401,
      res,
    });
  }
};

export { checkUser };
