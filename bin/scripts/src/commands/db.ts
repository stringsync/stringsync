import { Command, flags } from '@oclif/command';
import { spawn } from 'child_process';
import { ROOT_PATH, PROJECT_ARG } from '../util';

export default class Db extends Command {
  static description = 'Runs a db console.';

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
