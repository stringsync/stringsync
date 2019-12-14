import { execSync } from 'child_process';
import { cmd } from './cmd';

interface BuildDOckerImageSyncOptions {
  imageTagName: string;
  dockerfilePath: string;
  dockerContextPath: string;
  cwd: string;
}

export const buildDockerImageSync = (opts: BuildDOckerImageSyncOptions) => {
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
