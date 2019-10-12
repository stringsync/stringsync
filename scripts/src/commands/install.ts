import { Command, flags } from '@oclif/command';
import { ROOT_PATH } from '../util/constants';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

const INSTALLATION_DIRS = [
  ROOT_PATH,
  path.join(ROOT_PATH, 'server'),
  path.join(ROOT_PATH, 'web'),
];

export default class Install extends Command {
  static description = 'Reinstalls node_modules throughout the project';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Install);

    for (const dir of INSTALLATION_DIRS) {
      const nodeModulesPath = path.join(dir, 'node_modules');
      const installing = fs.existsSync(nodeModulesPath)
        ? 'reinstalling'
        : 'installing';
      this.log(`🦑  ${installing} node_modules in ${dir}`);
      execSync(`rm -rf ${nodeModulesPath}`);
      execSync(`(cd ${dir} && yarn)`);
    }
  }
}
