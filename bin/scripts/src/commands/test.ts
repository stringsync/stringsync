import { Command, flags } from '@oclif/command';
import { PROJECT_ARG, ROOT_PATH } from '../util/constants';
import { getTestCmdArgs } from '../util';
import { execSync } from 'child_process';

export default class Test extends Command {
  static description = 'describe the command here';

  static flags = {
    watch: flags.boolean({ char: 'w', default: false }),
  };

  static args = [{ ...PROJECT_ARG, required: true }];

  async run() {
    const { args, flags } = this.parse(Test);

    execSync(['./bin/ss', 'build', args.project].join(' '), {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });

    let exit = 0;
    try {
      execSync(
        ['docker-compose', ...getTestCmdArgs(args.project, flags.watch)].join(
          ' '
        ),
        {
          cwd: ROOT_PATH,
          stdio: 'inherit',
        }
      );
    } catch (e) {
      exit = 1;
    }

    execSync(['./bin/ss', 'down', args.project].join(' '), {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });

    this.exit(exit);
  }
}
