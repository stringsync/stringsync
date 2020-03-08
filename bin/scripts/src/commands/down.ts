import { Command, flags } from '@oclif/command';
import { PROJECT_ARG, ROOT_PATH } from '../util/constants';
import { getDockerComposeFile } from '../util';
import { spawn } from 'child_process';

export default class Down extends Command {
  static description = 'Turns down a docker-compose environment.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [PROJECT_ARG];

  async run() {
    const { args } = this.parse(Down);

    spawn(
      'docker-compose',
      [
        '-f',
        getDockerComposeFile(args.project),
        '-p',
        args.project,
        'down',
        '--volumes',
      ],
      { cwd: ROOT_PATH, stdio: 'inherit' }
    );
  }
}
