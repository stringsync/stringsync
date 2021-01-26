import { Command, flags } from '@oclif/command';
import { spawn } from 'child_process';
import { ROOT_PATH } from '../util';

export default class Lint extends Command {
  static description = 'lints the entire project';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Lint);

    spawn('yarn', ['eslint', '--max-warnings', '1', '--ext', 'ts,tsx', 'packages'], {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });
  }
}
