import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util';

export default class Build extends Command {
  static description = 'Builds the stringsync image';

  static flags = {
    help: flags.help({ char: 'h' }),
    tag: flags.string({ char: 't', default: 'latest' }),
  };

  async run() {
    const { flags } = this.parse(Build);
    const tag = `stringsync:${flags.tag}`;
    execSync(`docker build -t ${tag} .`, { cwd: ROOT_PATH, stdio: 'inherit' });
  }
}
