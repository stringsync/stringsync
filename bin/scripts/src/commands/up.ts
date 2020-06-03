import { Command, flags } from '@oclif/command';
import { ROOT_PATH, PROJECT_ARG, getDockerComposeFile } from '../util';
import { spawn } from 'child_process';

export default class Up extends Command {
  static description = 'Spins up a development environment';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [PROJECT_ARG];

  async run() {
    const { args } = this.parse(Up);

    spawn('docker-compose', ['-f', getDockerComposeFile(args.project), '-p', args.project, 'up', '--build', '-d'], {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });
  }
}
