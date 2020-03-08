import { Command, flags } from '@oclif/command';
import { ROOT_PATH } from '../util';
import { spawn } from 'child_process';

export default class Lint extends Command {
  static description = 'Lints the entire project (except node_modules).';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Lint);

    spawn(
      'yarn',
      [
        'eslint',
        '--max-warnings',
        '1',
        '--ext',
        'ts,tsx',
        'common',
        'server/src',
        'bin/scripts/src',
        'web/src',
        'e2e/src',
      ],
      { cwd: ROOT_PATH, stdio: 'inherit' }
    );
  }
}
