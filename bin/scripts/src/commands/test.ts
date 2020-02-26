import { Command, flags } from '@oclif/command';
import { PROJECT_ARG } from '../util/constants';
import {
  getTestCmd,
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

    execSyncFromRootPath(cmd(getDockerComposeCmd(args.project), 'build'));

    let exit = 0;
    try {
      execSyncFromRootPath(getTestCmd(args.project, flags.watch));
    } catch (e) {
      exit = 1;
    }

    execSyncFromRootPath(cmd('./bin/ss', 'down', args.project));

    this.exit(exit);
  }
}
