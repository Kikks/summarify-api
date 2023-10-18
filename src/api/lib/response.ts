import { Response } from 'express';

import { logger } from '../../config/winston';
import { SUCCESSFUL } from './constants';

interface IData {
  data?: any;
  message:
    | string
    | {
        [key: string]: string;
      };
  errStack?: any;
}

interface IRespond {
  res: Response;
  status: boolean;
  data: IData;
  httpCode: number;
}

const respond = ({ res, status, httpCode, data }: IRespond) => {
  const response = {
    status,
    data: data.data,
    message: data.message,
  };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Method', '*');
  return res.status(httpCode).send(response);
};

interface ISuccess {
  res: Response;
  data: any;
  httpCode: number;
  message?: string;
}

interface IFail {
  res: Response;
  message:
    | string
    | {
        [key: string]: string;
      };
  errStack?: any;
  httpCode: number;
}

export const success = ({ res, data, message, httpCode }: ISuccess) => {
  const dataToSend: IData = {
    data,
    message: message || SUCCESSFUL,
  };
  return respond({ res, status: true, httpCode, data: dataToSend });
};

export const failure = ({ res, message, errStack, httpCode }: IFail) => {
  const dataToSend: IData = {
    message,
    errStack,
  };

  logger.error({
    ...dataToSend,
    httpCode,
  });

  return respond({
    res,
    status: false,
    httpCode: isNaN(httpCode) ? 500 : httpCode,
    data: dataToSend,
  });
};
