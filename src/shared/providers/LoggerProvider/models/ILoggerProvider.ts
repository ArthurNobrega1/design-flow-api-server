interface ILoggerProvider {
  info(message: string): void;
  warn(message: string): void;
  error(message: string, stack?: string): void;
}

export default ILoggerProvider;
