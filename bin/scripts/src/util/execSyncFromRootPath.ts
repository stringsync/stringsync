import { execSync as _execSync, execSync } from 'child_process';
import { ROOT_PATH } from './constants';

export const execSyncFromRootPath = (cmd: string) => {
  return execSync(cmd, {
    stdio: 'inherit',
    cwd: ROOT_PATH,
  });
};
