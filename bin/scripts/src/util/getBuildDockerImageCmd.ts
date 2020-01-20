import { cmd } from './cmd';

export const getBuildDockerImageCmd = (
  imageTagName: string,
  dockerfilePath: string,
  dockerContextPath: string
) => {
  return cmd(
    'docker',
    'build',
    '-t',
    imageTagName,
    '-f',
    dockerfilePath,
    dockerContextPath
  );
};
