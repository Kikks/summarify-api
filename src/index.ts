import * as dotenv from 'dotenv';
dotenv.config();

import * as http from 'http';
import passport from 'passport';

import { NODE_ENV, PORT } from './api/lib/constants';
import { startdb } from './db';
import { summarifyAPI } from './server';

/** Normalize a port into a number, string, or false. */
const normalizePort = (val: string): number => {
  const connPort = parseInt(val, 10);
  return connPort >= 0 ? connPort : isNaN(connPort) ? 9999 : 0;
};

/** Event listener for HTTP server "error" event. */
const onError = (error: any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${error.code}: ${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${error.code}: ${bind} is already in use`);
      process.exit(1);
      break;
    default:
      console.error(`${error.code}: an unknow error occured.`);
      throw error;
  }
};

const nodeEnv: string | undefined = NODE_ENV;
const port: number = normalizePort(PORT || '4000');

/** Event listener for HTTP server "listening" event. */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  if (process.env.NODE_ENV !== 'test') {
    console.info(`Listening on ${bind} in ${nodeEnv} environment`);
  }
};

/** Initialize api service */
const api = new summarifyAPI();
const app = api.app;
app.use(passport.initialize());
app.use(passport.session());

app.set('port', port);

/** Create HTTP server. */
const server: http.Server = http.createServer(app);

startdb()
  .then(() => {
    console.info('Connected to database');

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  })
  .catch((error) => {
    console.error(error);
  });

export { server, app };
