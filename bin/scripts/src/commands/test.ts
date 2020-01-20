import { Command, flags } from '@oclif/command';
import { ROOT_PATH, PROJECTS, PROJECT_ARG } from '../util/constants';
import { execSync } from 'child_process';
import {
  getRunTestCmd,
  getBuildDockerImageCmd,
  getDockerComposeCmd,
  cmd,
} from '../util';

export default class Test extends Command {
  static description = 'describe the command here';

  static flags = {
    watch: flags.boolean({ char: 'w', default: false }),
  };

  static args = [{ ...PROJECT_ARG, required: true }];

  async run() {
    const { args, flags } = this.parse(Test);

    execSync(getBuildDockerImageCmd('ss-root:latest', 'Dockerfile', '.'), {
      stdio: 'inherit',
      cwd: ROOT_PATH,
    });

    execSync(cmd(getDockerComposeCmd(args.project), 'build'), {
      stdio: 'inherit',
      cwd: ROOT_PATH,
    });

    let exit = 0;
    try {
      execSync(getRunTestCmd(args.project, flags.watch), {
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
