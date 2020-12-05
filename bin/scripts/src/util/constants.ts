import * as path from 'path';
import { Project } from './types';

// dirname is bin, since the commands will be run from there
export const ROOT_PATH = path.join(__dirname, '..', '..', '..', '..');

export const DOCKER_PATH = path.join(ROOT_PATH, 'docker');

export const PROJECTS: Project[] = ['main', 'e2e', 'server', 'web'];

export const PROJECT_ARG = {
  name: 'project',
  required: false,
  default: 'main',
  options: PROJECTS,
};
