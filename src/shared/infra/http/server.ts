import 'reflect-metadata';
import '@shared/container';

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import '@shared/database';
import cors from 'cors';
import AppError from '@shared/errors/AppError';
import { container } from 'tsyringe';
import ILoggerProvider from '@shared/providers/LoggerProvider/models/ILoggerProvider';
import { isCelebrateError } from 'celebrate';
import routes from './routes/index';
import setupSwagger from './swagger';

const logger = container.resolve<ILoggerProvider>('LoggerProvider');

const port = 3333;

const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (isCelebrateError(err)) {
      const errorDetails: string[] = [];

      err.details.forEach(value => {
        errorDetails.push(`${value.message}`);
      });

      logger.error(`Erro de validação: ${errorDetails.join('; ')}`);
      response
        .status(400)
        .json({ message: 'Erro de validação', details: errorDetails });
      return;
    }

    if (err instanceof AppError) {
      logger.error(err.message);
      response.status(err.statusCode).json({ message: err.message });
      return;
    }

    logger.error(
      `Erro interno no servidor${err.message ? `: ${err.message}` : ''}`,
    );
    response.status(500).json({ message: 'Erro interno no servidor' });
  },
);

app.listen(port, () => {
  logger.info(`Acesse em http://localhost:${port}`);
});
