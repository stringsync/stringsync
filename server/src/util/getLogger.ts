import { createLogger, transports } from 'winston';

export const getLogger = () => {
  return createLogger({
    transports: [new transports.Console()],
  });
};
