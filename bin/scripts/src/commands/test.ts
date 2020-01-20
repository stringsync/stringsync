import { Command, flags } from '@oclif/command';
import { buildDockerImageSync } from '../util/buildDockerImageSync';
import { ROOT_PATH, PROJECTS } from '../util/constants';
import { execSync } from 'child_process';
import { cmd } from '../util/cmd';
import { getDockerComposeFile, Project } from '../util';

const getRunTestCmd = (
  project: Project,
  dockerComposeFile: string,
  watch: boolean
): string => {
  switch (project) {
    case 'server':
      return cmd(
        'docker-compose',
        '-f',
        dockerComposeFile,
        '-p',
        project,
        'run',
        '--rm',
        'server',
        'yarn',
        'test',
        `--watchAll=${watch}`
      );
    case 'web':
      return cmd(
        'docker-compose',
        '-f',
        dockerComposeFile,
        '-p',
        project,
        'run',
        '--rm',
        'web',
        'yarn',
        'test',
        `--watchAll=${watch}`
      );
    case 'e2e':
      return cmd(
        'docker-compose',
        '-f',
        dockerComposeFile,
        '-p',
        project,
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

export default class Test extends Command {
  static description = 'describe the command here';

  static flags = {
    watch: flags.boolean({ char: 'w', default: false }),
  };

  static args = [{ name: 'project', required: true, options: PROJECTS }];

  async run() {
    const { args, flags } = this.parse(Test);

    const dockerComposeFile = getDockerComposeFile(args.project);

    buildDockerImageSync({
      imageTagName: 'ss-root:latest',
      dockerfilePath: 'Dockerfile',
      dockerContextPath: '.',
      cwd: ROOT_PATH,
    });
    execSync(cmd('docker-compose', '-f', dockerComposeFile, 'build'), {
      stdio: 'inherit',
      cwd: ROOT_PATH,
    });

    let exit = 0;
    try {
      execSync(getRunTestCmd(args.project, dockerComposeFile, flags.watch), {
        stdio: 'inherit',
        cwd: ROOT_PATH,
      });
    } catch (e) {
      exit = 1;
    }

    execSync(cmd('./bin/ss', 'down', args.project), {
      stdio: 'inherit',
      cwd: ROOT_PATH,
    });
    this.exit(exit);
  }
}
