import { Command, flags } from '@oclif/command';
import { execSync, spawn } from 'child_process';
import { DOCKER_PATH, getDockerComposeFile, PROJECT_ARG } from '../util';

export default class Up extends Command {
  static description = 'spins up a development environment';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [PROJECT_ARG];

  async run() {
    const { args } = this.parse(Up);

    if (args.project === 'web') {
      execSync('yarn web dev', { cwd: DOCKER_PATH, stdio: 'inherit' });
      this.exit();
    }

    spawn('docker-compose', ['-p', args.project, '-f', getDockerComposeFile(args.project), 'up', '--build', '-d'], {
      cwd: DOCKER_PATH,
      stdio: 'inherit',
    });
  }
}
