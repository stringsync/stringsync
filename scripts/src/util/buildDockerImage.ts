import { execSync } from 'child_process';

interface BuildDOckerImageSyncOptions {
  imageTagName: string;
  dockerfilePath: string;
  dockerContextPath: string;
  cwd: string;
}

export const buildDockerImageSync = (opts: BuildDOckerImageSyncOptions) => {
  const cmd = [
    'docker',
    'build',
    '-t',
    opts.imageTagName,
    '-f',
    opts.dockerfilePath,
    opts.dockerContextPath,
  ].join(' ');

  execSync(cmd, { cwd: opts.cwd, stdio: 'inherit' });
};
