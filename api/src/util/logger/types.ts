export type LoggerMeta = Record<string, any>;

export interface Logger {
  debug(msg: string): void;
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
  getMeta(): LoggerMeta;
  mergeMeta(meta: LoggerMeta): void;
  setMeta(meta: LoggerMeta): void;
}
