import { wait } from '@stringsync/common';

export const onExit = (callback: () => Promise<void>, maxWaitMs: number) => {
  const cb = async () => {
    await Promise.race([wait(maxWaitMs), callback()]);
  };

  process.on('exit', cb);
  process.on('SIGINT', cb);
};
