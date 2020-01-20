import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH, PROJECTS, PROJECT_ARG } from '../util/constants';
import { cmd, getDockerComposeFile } from '../util';

export default class Down extends Command {
  static description = 'Turns down a docker-compose environment.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [PROJECT_ARG];

  async run() {
    const { args } = this.parse(Down);

    execSync(
      cmd(
        'docker-compose',
        '-f',
        getDockerComposeFile(args.project),
        '-p',
        args.project,
        'down',
        '--volumes'
      ),
      {
        stdio: 'inherit',
        cwd: ROOT_PATH,
      }
    );
  }
}
