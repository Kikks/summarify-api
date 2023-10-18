import { Response } from 'express';

import summarifyError from '../../lib/error';
import { failure } from '../../lib/response';

export const isEmpty = (value?: string | number) =>
  typeof value === 'undefined' || String(value).trim() === '';

export const isEmail = (string: string) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (string.match(regex)) {
    return true;
  } else {
    return false;
  }
};

export const inputError = (
  message:
    | string
    | {
        [key: string]: string;
      },
  res: Response
) =>
  failure({
    res,
    message,
    httpCode: 400,
  });

export const checkExistingEntity = (fn: any, message: string) => {
  const existingEntity = fn;
  if (existingEntity) {
    throw new summarifyError(message, 400);
  }
};
