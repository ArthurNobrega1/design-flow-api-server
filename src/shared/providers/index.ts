import { container } from 'tsyringe';

import WinstonLoggerProvider from './LoggerProvider/implementations/WinstonLoggerProvider';
import ILoggerProvider from './LoggerProvider/models/ILoggerProvider';

import BrevoMailProvider from './MailProvider/implementations/BrevoMailProvider';
import IMailProvider from './MailProvider/models/IMailProvider';

import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';
import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';

import CloudinaryStorageProvider from './StorageProvider/implementations/CloudinaryStorageProvider';
import IStorageProvider from './StorageProvider/models/IStorageProvider';

container.registerSingleton<ILoggerProvider>(
  'LoggerProvider',
  WinstonLoggerProvider,
);

container.registerSingleton<IMailProvider>('MailProvider', BrevoMailProvider);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  CloudinaryStorageProvider,
);
