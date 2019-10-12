import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util/constants';

export default class Down extends Command {
  static description = 'Turns down a development environment.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Down);
    execSync('docker-compose down', { cwd: ROOT_PATH });
  }
}
