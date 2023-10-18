import jwt from 'jsonwebtoken';

import { JWT_SECRET_KEY } from './constants';

const generateToken = (data: any, duration?: string) => {
  return jwt.sign(data, JWT_SECRET_KEY as string, { expiresIn: duration || '30d' });
};

export { generateToken };
