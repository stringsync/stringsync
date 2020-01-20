import { Command, flags } from '@oclif/command';
import { ROOT_PATH, PROJECTS, PROJECT_ARG } from '../util/constants';
import { execSync } from 'child_process';
import {
  getRunTestCmd,
  getBuildDockerImageCmd,
  getDockerComposeCmd,
  cmd,
  execSyncFromRootPath,
} from '../util';

export default class Test extends Command {
  static description = 'describe the command here';

  static flags = {
    watch: flags.boolean({ char: 'w', default: false }),
  };

  static args = [{ ...PROJECT_ARG, required: true }];

  async run() {
    const { args, flags } = this.parse(Test);

    execSyncFromRootPath(
      getBuildDockerImageCmd('ss-root:latest', 'Dockerfile', '.')
    );

    execSyncFromRootPath(cmd(getDockerComposeCmd(args.project), 'build'));

    let exit = 0;
    try {
      execSyncFromRootPath(getRunTestCmd(args.project, flags.watch));
    } catch (e) {
      exit = 1;
    }

    execSyncFromRootPath(cmd('./bin/ss', 'down', args.project));

    this.exit(exit);
  }
}
