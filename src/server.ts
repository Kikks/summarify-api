import 'reflect-metadata';
import './config/auth.config';

// import bluebird from 'bluebird';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import routes from './api/routes';

export class summarifyAPI {
  readonly server: Application;

  public constructor() {
    this.server = express();
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(morgan('dev'));

    this.server.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Authorization, Content-Type, Accept, x-auth-token'
      );
      next();
    });

    this.routes();
  }

  public async init() {
    return new summarifyAPI();
  }

  public routes(app?: Application) {
    // (global as any).Promise = bluebird as any;
    const expressApp = app || this.server;
    expressApp.use(routes);
  }

  get app() {
    if (!this.server) {
      this.init();
    }
    return this.server;
  }
}
