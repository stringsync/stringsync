import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util';

export default class Typecheck extends Command {
  static description = 'typecheck the project';

  static flags = {
    help: flags.help({ char: 'h' }),
    watch: flags.boolean({ char: 'w', default: false }),
  };

  static args = [{ name: 'file' }];

  async run() {
    const { flags } = this.parse(Typecheck);

    execSync(['yarn', 'tsc', '--noEmit', flags.watch ? '--watch' : ''].filter((part) => part).join(' '), {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });
  }
}
