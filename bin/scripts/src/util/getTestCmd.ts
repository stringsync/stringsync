import { Project } from './types';
import { cmd } from './cmd';
import { getDockerComposeCmd } from './getDockerComposeCmd';

export const getTestCmd = (project: Project, watch: boolean): string => {
  switch (project) {
    case 'server':
      return cmd(
        getDockerComposeCmd(project),
        'run',
        '--rm',
        '--name',
        'server_test',
        'server',
        'yarn',
        'test',
        '--runInBand',
        '--detectOpenHandles',
        `--watchAll=${watch}`
      );
    case 'web':
      return cmd(
        getDockerComposeCmd(project),
        'run',
        '--rm',
        '--name',
        'web_test',
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
        `--watchAll=${watch}`
      );
    default:
      throw new TypeError(`unexpected project: ${project}`);
  }
};
