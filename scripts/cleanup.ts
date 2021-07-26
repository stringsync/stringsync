import chalk from 'chalk';
import nodeCleanup from 'node-cleanup';
import { log } from './util';

type AsyncCallback = () => Promise<void>;

export const cleanup = (() => {
  let isClean = false;
  let hasStartedCleaning = false;
  const callbacks = new Array<AsyncCallback>();

  const doCleanup = async () => {
    log(chalk.yellow('cleanup started'));
    hasStartedCleaning = true;
    await Promise.allSettled(callbacks.map((callback) => callback()));
    isClean = true;
    log(chalk.yellow('cleanup finished, press Control-C again to exit'));
  };

  nodeCleanup((exitCode, signal) => {
    if (callbacks.length === 0) {
      return true;
    }
    if (!isClean && !hasStartedCleaning) {
      doCleanup();
    }
    // returning true causes immediate exit
    // returning false prevents immediate exit
    return isClean;
  });

  return (callback: AsyncCallback) => {
    callbacks.push(callback);
  };
})();
