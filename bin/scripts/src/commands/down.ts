import { Command, flags } from '@oclif/command';
import { PROJECT_ARG } from '../util/constants';
import { cmd, getDockerComposeFile, execSyncFromRootPath } from '../util';

export default class Down extends Command {
  static description = 'Turns down a docker-compose environment.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [PROJECT_ARG];

  async run() {
    const { args } = this.parse(Down);

    execSyncFromRootPath(
      cmd(
        'docker-compose',
        '-f',
        getDockerComposeFile(args.project),
        '-p',
        args.project,
        'down',
        '--volumes'
      )
    );
  }
}
