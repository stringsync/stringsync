import { Command, flags } from '@oclif/command';
import fs from 'fs';
import path from 'path';
import { ROOT_PATH } from '../util';

const PACKAGES_PATH = path.join(ROOT_PATH, 'packages');

const PACKAGE_JSON_MAIN = 'dist/index.js';

export default class Productionize extends Command {
  static description = 'update files for production';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Productionize);

    fs.readdirSync(PACKAGES_PATH, { withFileTypes: true })
      .filter((src) => src.isDirectory())
      .map((dir) => path.join(PACKAGES_PATH, dir.name, 'package.json'))
      .filter((file) => fs.existsSync(file))
      .forEach((file) => {
        const input = fs.readFileSync(file, 'utf8');
        const json = JSON.parse(input);
        json['main'] = PACKAGE_JSON_MAIN;
        const output = JSON.stringify(json, null, 2);
        fs.writeFileSync(file, output);
      });
  }
}
