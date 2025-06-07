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
import { MulterError } from 'multer';
import { MAX_FILE_SIZE, MAX_FILES_COUNT } from '@config/upload';
import routes from './routes/index';
import setupSwagger from './swagger';

const logger = container.resolve<ILoggerProvider>('LoggerProvider');

const internalPort = Number(process.env.INTERNAL_PORT) || 3333;
const externalPort = process.env.PORT || internalPort;

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

    if (err instanceof MulterError) {
      let message = '';

      if (err.code === 'LIMIT_FILE_SIZE') {
        message = `Arquivo excede o tamanho máximo permitido de ${MAX_FILE_SIZE}MB.`;
      } else if (err.code === 'LIMIT_FILE_COUNT') {
        message = `Número máximo de arquivos excedido. Limite: ${MAX_FILES_COUNT} arquivos por requisição.`;
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        message = 'Campo de arquivo inesperado.';
      } else {
        message = `Erro no upload: ${err.message}`;
      }

      logger.error(message);
      response.status(400).json({ message });
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

app.listen(internalPort, () => {
  logger.info(`Acesse em http://localhost:${externalPort}`);
});
