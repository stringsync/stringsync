import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util/constants';

export default class Down extends Command {
  static description = 'Turns down a docker-compose environment.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [
    { name: 'file', required: false, default: 'docker-compose.yml' },
  ];

  async run() {
    const { args } = this.parse(Down);

    execSync(`docker-compose -f ${args.file} down --volumes`, {
      cwd: ROOT_PATH,
    });
  }
}
