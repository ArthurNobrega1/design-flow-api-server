import { configDotenv } from 'dotenv';
import { DataSource } from 'typeorm';
import * as glob from 'glob';
import AppError from '@shared/errors/AppError';

configDotenv();

if (
  !process.env.TYPEORM_USER ||
  !process.env.TYPEORM_PASSWORD ||
  !process.env.TYPEORM_HOST ||
  !process.env.TYPEORM_PORT ||
  !process.env.TYPEORM_DB ||
  !process.env.TYPEORM_LOGGING ||
  !process.env.TYPEORM_SYNCHRONIZE
) {
  throw new AppError(
    'Faltam variáveis de ambiente para conexão com o PostgreSQL',
    500,
  );
  process.exit(1);
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT || '5432', 10),
  username: process.env.TYPEORM_USER,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DB,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  entities: glob
    .sync('src/modules/*/infra/typeorm/entities/*.ts', {
      absolute: true,
    })
    // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-require-imports
    .map(file => require(file).default),
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    throw new AppError(
      `Erro ao conectar ao PostgreSQL: ${
        error instanceof Error ? error.message : 'Erro desconhecido'
      }`,
      500,
    );
  }
};

connectDatabase();
