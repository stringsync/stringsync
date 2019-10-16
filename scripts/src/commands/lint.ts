import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util/constants';

export default class Lint extends Command {
  static description = 'Lints the entire project (except node_modules).';

  static flags = {
    help: flags.help({ char: 'h' }),
    gitStagedOnly: flags.boolean({ char: 's' }),
  };

  async run() {
    const { flags } = this.parse(Lint);

    const cmd = [
      flags.gitStagedOnly
        ? 'git diff --diff-filter=d --cached --name-only | xargs'
        : '',
      'yarn eslint --max-warnings 1 --ext ts,tsx',
      flags.gitStagedOnly
        ? ''
        : './common ./server/src ./scripts/src ./web/src',
    ]
      .filter((str) => str.length > 0)
      .join(' ');

    execSync(cmd, { stdio: 'inherit', cwd: ROOT_PATH });
  }
}
