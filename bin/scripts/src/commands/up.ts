import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import {
  ROOT_PATH,
  getBuildDockerImageCmd,
  cmd,
  getDockerComposeCmd,
  PROJECT_ARG,
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

    execSync(getBuildDockerImageCmd('ss-root:latest', 'Dockerfile', '.'), {
      stdio: 'inherit',
      cwd: ROOT_PATH,
    });

    execSync(
      cmd(
        getDockerComposeCmd(args.project),
        'up',
        '--build',
        flags.attach ? '' : '-d'
      ),
      {
        stdio: 'inherit',
        cwd: ROOT_PATH,
      }
    );
  }
}
