import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util/constants';

export default class Bounce extends Command {
  static description = 'Performs a hard reset on the development environment';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Bounce);
    execSync('./bin/ss down', { stdio: 'inherit', cwd: ROOT_PATH });
    execSync('./bin/ss up', { stdio: 'inherit', cwd: ROOT_PATH });
  }
}
