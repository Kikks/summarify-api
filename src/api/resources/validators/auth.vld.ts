import { Request, Response } from 'express';
import Joi from 'joi';

import { validateShema } from './helpers.vld';

const loginSchema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

const validateLoginInputs = (req: Request, res: Response) => validateShema(loginSchema, req, res);
const validateRegisterInputs = (req: Request, res: Response) =>
  validateShema(registerSchema, req, res);
const validateChangePasswordInputs = (req: Request, res: Response) =>
  validateShema(changePasswordSchema, req, res);

export { validateLoginInputs, validateRegisterInputs, validateChangePasswordInputs };
