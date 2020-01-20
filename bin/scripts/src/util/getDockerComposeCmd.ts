import { Project } from './types';
import { getDockerComposeFile } from './getDockerComposeFile';
import { cmd } from './cmd';

export const getDockerComposeCmd = (project: Project) => {
  const dockerComposeFile = getDockerComposeFile(project);
  return cmd('docker-compose', '-f', dockerComposeFile, '-p', project);
};
