import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util/constants';

export default class Db extends Command {
  static description = 'Runs a db console.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Db);
    execSync('./bin/ss exec db psql -U stringsync', {
      stdio: 'inherit',
      cwd: ROOT_PATH,
    });
  }
}
