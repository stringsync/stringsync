import { Command, flags } from '@oclif/command';
import { exec } from 'child_process';
import { ROOT_PATH } from '../util';
import * as path from 'path';

export default class Build extends Command {
  static description = 'Builds a StringSync service.';

  static flags = {
    help: flags.help({ char: 'h' }),
    tag: flags.string({ char: 't', default: 'latest' }),
  };

  static args = [{ name: 'service', options: ['server', 'web', 'e2e'] }];

  async run() {
    const { args, flags } = this.parse(Build);

    const tag = `ss-${args.service}:${flags.tag}`;
    const cwd = path.join(ROOT_PATH, args.service);

    this.log(`building ${tag} from ${cwd}`);
    await exec(`docker build -t ${tag} .`, { cwd });
  }
}
