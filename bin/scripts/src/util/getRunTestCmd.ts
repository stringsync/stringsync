import { Project } from './types';
import { cmd } from './cmd';
import { getDockerComposeCmd } from './getDockerComposeCmd';

export const getRunTestCmd = (project: Project, watch: boolean): string => {
  switch (project) {
    case 'server':
      return cmd(
        getDockerComposeCmd(project),
        'run',
        '--rm',
        'server',
        'yarn',
        'test',
        `--watchAll=${watch}`
      );
    case 'web':
      return cmd(
        getDockerComposeCmd(project),
        'run',
        '--rm',
        'web',
        'yarn',
        'test',
        `--watchAll=${watch}`
      );
    case 'e2e':
      return cmd(
        getDockerComposeCmd(project),
        'run',
        '--rm',
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
        `--watchAll=${watch}`
      );
    default:
      throw new TypeError(`unexpected project: ${project}`);
  }
};
