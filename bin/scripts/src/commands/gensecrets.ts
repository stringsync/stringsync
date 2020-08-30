import { Command, flags } from '@oclif/command';
import { ROOT_PATH } from '../util';
import path from 'path';
import { existsSync } from 'fs';
import { writeFileSync } from 'fs';

const FILE_NAME = 'secrets.env';

export default class Gensecrets extends Command {
  static description = 'Creates the secrets.env file needed for local development.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    const filepath = path.join(ROOT_PATH, FILE_NAME);

    if (existsSync(filepath)) {
      this.log(`secrets file already exists: ${filepath}`);
      this.exit();
    }

    this.log(`creating secrets file: ${filepath}`);
    writeFileSync(filepath, '');
    this.log('done');
  }
}
