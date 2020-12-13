import { wait } from '@stringsync/common';

export const onExit = (callback: () => Promise<void>, maxWaitMs: number) => {
  process.on('exit', async () => {
    await Promise.race([wait(maxWaitMs), callback()]);
  });
};
