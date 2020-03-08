import { Command, flags } from '@oclif/command';
import { PROJECT_ARG, ROOT_PATH } from '../util/constants';
import { getTestCmdArgs } from '../util';
import { spawn } from 'child_process';
import { promisify } from 'util';

export default class Test extends Command {
  static description = 'describe the command here';

  static flags = {
    watch: flags.boolean({ char: 'w', default: false }),
  };

  static args = [{ ...PROJECT_ARG, required: true }];

  async run() {
    const { args, flags } = this.parse(Test);

    spawn('./bin/ss', ['build', args.project], {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    }).on('exit', () => {
      spawn('docker-compose', getTestCmdArgs(args.project, flags.watch), {
        cwd: ROOT_PATH,
        stdio: 'inherit',
      }).on('exit', (code) => {
        spawn('./bin/ss', ['down', args.project], {
          cwd: ROOT_PATH,
          stdio: 'inherit',
        }).on('exit', () => {
          if (typeof code === 'number' && code !== 0) {
            this.exit(code);
          }
        });
      });
    });
  }
}
