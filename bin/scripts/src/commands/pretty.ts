import { Command, flags } from '@oclif/command';
import { spawn } from 'child_process';
import { ROOT_PATH } from '../util';

export default class Pretty extends Command {
  static description = 'check the code formatting';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Pretty);

    spawn('yarn', ['prettier', '--check', 'bin/scripts/src/**/*.ts', 'packages/**/*.ts', 'packages/**/*.tsx'], {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });
  }
}
