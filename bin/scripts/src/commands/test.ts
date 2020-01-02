import { Command, flags } from '@oclif/command';
import { buildDockerImageSync } from '../util/buildDockerImageSync';
import { ROOT_PATH } from '../util/constants';
import { execSync } from 'child_process';
import { cmd } from '../util/cmd';

const getRunTestCmd = (
  service: string,
  dockerComposeFile: string,
  watch: boolean
): string => {
  switch (service) {
    case 'server':
      return cmd(
        'docker-compose',
        '-f',
        dockerComposeFile,
        'run',
        '--rm',
        'test-server',
        'yarn',
        'test',
        `--watchAll=${watch}`
      );
    case 'web':
      return cmd(
        'docker-compose',
        '-f',
        dockerComposeFile,
        'run',
        '--rm',
        'test-web',
        'yarn',
        'test',
        `--watchAll=${watch}`
      );
    case 'e2e':
      return cmd(
        'docker-compose',
        '-f',
        dockerComposeFile,
        'run',
        '--rm',
        'test-e2e',
        'wait-for-it.sh',
        '-t',
        '60',
        '-s',
        'test-e2e-web:8080',
        '--',
        'yarn',
        'test',
        `--watchAll=${watch}`
      );
    default:
      return '';
  }
};

export default class Test extends Command {
  static description = 'describe the command here';

  static flags = {
    watch: flags.boolean({ char: 'w', default: false }),
  };

  static args = [
    { name: 'service', required: true, options: ['server', 'web', 'e2e'] },
  ];

  async run() {
    const { args, flags } = this.parse(Test);

    const dockerComposeFile = `docker-compose.${args.service}.test.yml`;

    buildDockerImageSync({
      imageTagName: 'ss-root:latest',
      dockerfilePath: 'Dockerfile',
      dockerContextPath: '.',
      cwd: ROOT_PATH,
    });
    execSync(`docker-compose -f ${dockerComposeFile} build`, {
      stdio: 'inherit',
      cwd: ROOT_PATH,
    });

    let exit = 0;
    try {
      const runTestCmd = getRunTestCmd(
        args.service,
        dockerComposeFile,
        flags.watch
      );
      execSync(runTestCmd, {
        stdio: 'inherit',
        cwd: ROOT_PATH,
      });
    } catch (e) {
      exit = 1;
    }

    execSync(`./bin/ss down ${dockerComposeFile}`, {
      stdio: 'inherit',
      cwd: ROOT_PATH,
    });
    this.exit(exit);
  }
}
