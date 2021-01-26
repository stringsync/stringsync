import { Command, flags } from '@oclif/command';
import { existsSync, readFile, writeFileSync } from 'fs';
import path from 'path';
import { ROOT_PATH } from '../util';

const GITIGNORE_FILE_NAME = '.gitignore';
const FILE_NAME = 'secrets.env';
const FILE_TEMPLATE =
  'AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID\nAWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY\nAWS_REGION=YOUR_AWS_REGION';

export default class Gensecrets extends Command {
  static description = 'create the secrets.env file needed for local development';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    const filepath = path.join(ROOT_PATH, 'env', FILE_NAME);
    const gitignorePath = path.join(ROOT_PATH, GITIGNORE_FILE_NAME);

    if (existsSync(filepath)) {
      this.log(`secrets file already exists: ${filepath}`);
      this.exit();
    }

    let isSecretsFileIgnored = true;
    readFile(gitignorePath, (err, data) => {
      if (err) {
        throw err;
      }
      if (!data.includes(FILE_NAME)) {
        isSecretsFileIgnored = false;
      }
    });
    if (!isSecretsFileIgnored) {
      this.log(`secrets file is not ignored,  add '${FILE_NAME}' to ${gitignorePath}`);
      this.exit();
    }

    this.log(`creating secrets file: ${filepath}`);
    writeFileSync(filepath, FILE_TEMPLATE);
    this.log('done');
  }
}
