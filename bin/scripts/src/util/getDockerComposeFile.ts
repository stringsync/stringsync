import { Project } from './types';

export const getDockerComposeFile = (project: Project): string => {
  switch (project) {
    case 'main':
      return 'docker-compose.yml';
    case 'e2e':
      return 'docker-compose.e2e.yml';
    case 'server':
      return 'docker-compose.server.yml';
    case 'web':
      return 'docker-compose.web.yml';
    default:
      throw new TypeError(`invalid project: ${project}`);
  }
};
