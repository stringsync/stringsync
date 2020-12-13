import { Command, flags } from '@oclif/command';
import { spawn } from 'child_process';
import { getDockerComposeFile } from '../util';
import { DOCKER_PATH, PROJECT_ARG } from '../util/constants';

export default class Down extends Command {
  static description = 'Turns down a docker-compose environment.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [PROJECT_ARG];

  async run() {
    const { args } = this.parse(Down);

    spawn('docker-compose', ['-p', args.project, '-f', getDockerComposeFile(args.project), 'down', '--volumes'], {
      cwd: DOCKER_PATH,
      stdio: 'inherit',
    });
  }
}
