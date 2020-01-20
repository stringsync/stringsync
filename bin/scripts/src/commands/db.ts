import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH, cmd } from '../util';

export default class Db extends Command {
  static description = 'Runs a db console.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Db);
    execSync(
      cmd('./bin/ss', 'exec', 'main', 'db', 'psql', '-U', 'stringsync'),
      {
        stdio: 'inherit',
        cwd: ROOT_PATH,
      }
    );
  }
}
