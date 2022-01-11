import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import passport from 'passport';
import { Routes } from '@/interfaces/routes';
import errorMiddleware from '@/middlewares/error';
import { logger, stream } from '@/utils/logger';
import '@/middlewares/auth'
import BlockchainBackgroundService from './services/blockchain.background';
import SchedulerService from './services/scheduler';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  private blockchainBackgroundService = new BlockchainBackgroundService()
  private schedulerService = new SchedulerService()

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    this.initializeBackground();
    this.initializeScheduler();
  }

  public listen() {
    return this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan('dev', { stream }));
    this.app.use(cors());
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(passport.initialize());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use(route.path, route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeBackground() {
    this.blockchainBackgroundService.initialize();
  }

  private initializeScheduler() {
    this.schedulerService.initialize();
  }
}

export default App;
