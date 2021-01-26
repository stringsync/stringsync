import { Command, flags } from '@oclif/command';
import { spawn } from 'child_process';
import { PROJECT_ARG, ROOT_PATH } from '../util';

export default class Db extends Command {
  static description = 'runs a db console';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [PROJECT_ARG];

  async run() {
    const { args } = this.parse(Db);

    spawn('./bin/ss', ['exec', args.project, 'db', 'psql', '-U', 'stringsync'], {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });
  }
}
