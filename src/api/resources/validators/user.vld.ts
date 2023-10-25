import { Request, Response } from 'express';
import Joi from 'joi';

import { validateShema } from './helpers.vld';

const updateUserSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
});

const validateUpdateUserInputs = (req: Request, res: Response) =>
  validateShema(updateUserSchema, req, res);

export { validateUpdateUserInputs };
