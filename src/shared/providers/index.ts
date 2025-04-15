import { container } from 'tsyringe';

import ILoggerProvider from './LoggerProvider/models/ILoggerProvider';
import WinstonLoggerProvider from './LoggerProvider/implementations/WinstonLoggerProvider';

container.registerSingleton<ILoggerProvider>(
  'LoggerProvider',
  WinstonLoggerProvider,
);
