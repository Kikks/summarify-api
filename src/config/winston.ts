import { createLogger, format, transports } from 'winston';

import { NODE_ENV } from '../api/lib/constants';

const { combine, timestamp, label, printf } = format;

const myFormat = printf(
  ({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`
);
const logger = createLogger({
  format: combine(label({ label: `${NODE_ENV}` }), timestamp(), myFormat),
  transports: [new transports.Console(), new transports.File({ filename: 'combined.log' })],
});

export { logger };
