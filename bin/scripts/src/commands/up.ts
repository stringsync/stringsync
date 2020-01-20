import { Command, flags } from '@oclif/command';
import {
  ROOT_PATH,
  getBuildDockerImageCmd,
  cmd,
  getDockerComposeCmd,
  PROJECT_ARG,
  execSyncFromRootPath,
} from '../util';

export default class Up extends Command {
  static description = 'Spins up a development environment';

  static flags = {
    help: flags.help({ char: 'h' }),
    attach: flags.boolean({ char: 'a' }),
  };

  static args = [PROJECT_ARG];

  async run() {
    const { flags, args } = this.parse(Up);

    execSyncFromRootPath(
      getBuildDockerImageCmd('ss-root:latest', 'Dockerfile', '.')
    );

    execSyncFromRootPath(
      cmd(
        getDockerComposeCmd(args.project),
        'up',
        '--build',
        flags.attach ? '' : '-d'
      )
    );
  }
}
