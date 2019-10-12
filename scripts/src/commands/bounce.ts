import { Command, flags } from '@oclif/command';
import { execSync, spawn } from 'child_process';

export default class Bounce extends Command {
  static description = 'Performs a hard reset on the development environment';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    execSync('ss down', { stdio: 'inherit' });
    execSync('ss up', { stdio: 'inherit', maxBuffer: 10 });
  }
}
