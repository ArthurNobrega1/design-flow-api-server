import { createLogger, format, Logger, transports } from 'winston';
import { injectable } from 'tsyringe';
import ILoggerProvider from '../models/ILoggerProvider';

@injectable()
class WinstonLoggerProvider implements ILoggerProvider {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp({ format: 'HH:mm:ss' }),
            format.printf(
              info => `[${info.level}]: ${info.timestamp} ${info.message}`,
            ),
          ),
        }),
        // File transport (sem cores)
        new transports.File({
          filename: 'logs/app.log',
          format: format.combine(
            format.timestamp({ format: 'DD-MMM-YYYY HH:mm:ss' }),
            format.printf(
              info =>
                `[${info.level.toUpperCase()}]: ${info.timestamp} ${
                  info.message
                }`,
            ),
          ),
        }),
      ],
    });
  }

  info(message: string): void {
    this.logger.info(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string, stack?: string): void {
    this.logger.error(message, { stack });
  }
}

export default WinstonLoggerProvider;
