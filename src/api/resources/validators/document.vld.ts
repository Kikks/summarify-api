import { Request, Response } from 'express';
import Joi from 'joi';

import { validateShema } from './helpers.vld';

const createDocumentSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  fileType: Joi.string(),
});

const updateDocumentSchema = Joi.object({
  title: Joi.string(),
});

const createDocumentConversationSchema = Joi.object({
  content: Joi.string().required(),
});

const validateCreateDocumentInputs = (req: Request, res: Response) =>
  validateShema(createDocumentSchema, req, res);
const validateUpdateDocumentInputs = (req: Request, res: Response) =>
  validateShema(updateDocumentSchema, req, res);
const validateCreateDocumentConversationInputs = (req: Request, res: Response) =>
  validateShema(createDocumentConversationSchema, req, res);

export {
  validateCreateDocumentInputs,
  validateUpdateDocumentInputs,
  validateCreateDocumentConversationInputs,
};
