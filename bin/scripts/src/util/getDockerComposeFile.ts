import { Project } from './types';

export const getDockerComposeFile = (project: Project): string => {
  switch (project) {
    case 'main':
      return 'docker-compose.yml';
    case 'e2e':
      return 'docker-compose.e2e.yml';
    case 'api':
      return 'docker-compose.api.test.yml';
    case 'web':
      return 'docker-compose.web.test.yml';
    default:
      throw new TypeError(`invalid project: ${project}`);
  }
};
