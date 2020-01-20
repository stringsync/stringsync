import { execSync } from 'child_process';
import { cmd } from './cmd';

interface BuildDockerImageSyncOptions {
  imageTagName: string;
  dockerfilePath: string;
  dockerContextPath: string;
  cwd: string;
}

export const buildDockerImageSync = (opts: BuildDockerImageSyncOptions) => {
  execSync(
    cmd(
      'docker',
      'build',
      '-t',
      opts.imageTagName,
      '-f',
      opts.dockerfilePath,
      opts.dockerContextPath
    ),
    { cwd: opts.cwd, stdio: 'inherit' }
  );
};
