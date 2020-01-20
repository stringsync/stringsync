import { Command, flags } from '@oclif/command';
import { cmd, execSyncFromRootPath } from '../util';

export default class Lint extends Command {
  static description = 'Lints the entire project (except node_modules).';

  static flags = {
    help: flags.help({ char: 'h' }),
    gitStagedOnly: flags.boolean({ char: 's' }),
  };

  async run() {
    const { flags } = this.parse(Lint);

    execSyncFromRootPath(
      cmd(
        flags.gitStagedOnly
          ? 'git diff --diff-filter=d --cached --name-only | grep ".*tsx\\?$" | xargs'
          : '',
        'yarn eslint --max-warnings 1 --ext ts,tsx',
        flags.gitStagedOnly
          ? ''
          : 'common server/src bin/scripts/src web/src e2e/src'
      )
    );
  }
}
