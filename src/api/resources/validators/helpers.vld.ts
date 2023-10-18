import { Request, Response } from 'express';
import { ObjectSchema } from 'joi';

import summarifyError from '../../lib/error';

export const validateShema = (schema: ObjectSchema, req: Request, res: Response) => {
  const { value, error } = schema.validate(req.body);
  if (error) throw new summarifyError(error?.details?.[0]?.message, 400);
  return value;
};
