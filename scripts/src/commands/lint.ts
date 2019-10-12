import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util/constants';

export default class Lint extends Command {
  static description = 'Lints the entire project (except node_modules).';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    execSync(
      'yarn eslint --quiet --max-warnings 1 --ext ts,tsx  ./common ./server/src ./web/src',
      { stdio: 'inherit', cwd: ROOT_PATH }
    );
  }
}
