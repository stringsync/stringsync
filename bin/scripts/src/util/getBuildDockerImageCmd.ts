export const getBuildDockerImageCmd = (imageTagName: string, dockerfilePath: string, dockerContextPath: string) => {
  return ['docker', 'build', '-t', imageTagName, '-f', dockerfilePath, dockerContextPath].join(' ');
};
