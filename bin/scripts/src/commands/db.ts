import { Command, flags } from '@oclif/command';
import { cmd, execSyncFromRootPath } from '../util';

export default class Db extends Command {
  static description = 'Runs a db console.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Db);
    execSyncFromRootPath(
      cmd('./bin/ss', 'exec', 'main', 'db', 'psql', '-U', 'stringsync')
    );
  }
}
