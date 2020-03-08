import { Command, flags } from '@oclif/command';
import { spawn } from 'child_process';
import { ROOT_PATH } from '../util';

export default class Db extends Command {
  static description = 'Runs a db console.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Db);

    spawn('./bin/ss', ['exec', 'main', 'db', 'psql', '-U', 'stringsync'], {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });
  }
}
