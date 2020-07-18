export interface Logger {
  error(msg: string): void;
  warn(msg: string): void;
  info(msg: string): void;
}
