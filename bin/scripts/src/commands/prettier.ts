import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util/constants';

export default class Prettier extends Command {
  static description = 'describe the command here';

  static flags = {
    help: flags.help({ char: 'h' }),
    fix: flags.boolean({ char: 'f' }),
    gitStagedOnly: flags.boolean({ char: 's' }),
  };

  async run() {
    const { flags } = this.parse(Prettier);

    const cmd = [
      flags.gitStagedOnly
        ? 'git diff --diff-filter=d --cached --name-only | grep ".*tsx\\?$" | xargs'
        : '',
      'yarn prettier',
      flags.fix ? '--write' : '--check',
      flags.gitStagedOnly
        ? ''
        : '"common/**/*.ts" "server/src/**/*.ts" "bin/scripts/src/**/*.ts" "web/src/**/*.ts" "web/src/**/*.tsx"',
    ].join(' ');

    execSync(cmd, { stdio: 'inherit', cwd: ROOT_PATH });
  }
}
