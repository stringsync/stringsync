import { Command, flags } from '@oclif/command';
import { ROOT_PATH } from '../util';
import { spawn } from 'child_process';

export default class Pretty extends Command {
  static description = 'describe the command here';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Pretty);

    spawn(
      'yarn',
      [
        'prettier',
        '--check',
        'common/**/*.ts',
        'server/src/**/*.ts',
        'bin/scripts/src/**/*.ts',
        'web/src/**/*.ts',
        'web/src/**/*.tsx',
        'e2e/src/**/*.ts',
      ],
      { cwd: ROOT_PATH, stdio: 'inherit' }
    );
  }
}
