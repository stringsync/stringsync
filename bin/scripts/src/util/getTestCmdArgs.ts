import { Project } from './types';
import { getDockerComposeFile } from './getDockerComposeFile';

export const getTestCmdArgs = (project: Project, watch: boolean): string[] => {
  switch (project) {
    case 'server':
      return [
        '-f',
        getDockerComposeFile(project),
        '-p',
        project,
        'run',
        '--rm',
        '--name',
        'server_test',
        'server',
        'yarn',
        'test',
        '--forceExit',
        `--watchAll=${watch}`,
      ];
    case 'web':
      return [
        '-f',
        getDockerComposeFile(project),
        '-p',
        project,
        'run',
        '--rm',
        '--name',
        'web_test',
        'web',
        'yarn',
        'test',
        `--watchAll=${watch}`,
      ];
    case 'e2e':
      return [
        '-f',
        getDockerComposeFile(project),
        '-p',
        project,
        'run',
        '--rm',
        '--name',
        'e2e_test',
        'e2e',
        'wait-for-it.sh',
        '-t',
        '60',
        '-s',
        'web:8080',
        '--',
        'yarn',
        'test',
        '--runInBand',
        `--watchAll=${watch}`,
      ];
    default:
      throw new TypeError(`unexpected project: ${project}`);
  }
};
