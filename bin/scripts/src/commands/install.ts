import { Command, flags } from '@oclif/command';
import * as path from 'path';
import { spawn } from 'child_process';
import { ROOT_PATH } from '../util';
import rimraf from 'rimraf';

const INSTALLATION_DIRS = [
  ROOT_PATH,
  path.join(ROOT_PATH, 'server'),
  path.join(ROOT_PATH, 'web'),
  path.join(ROOT_PATH, 'e2e'),
];

const NODE_MODULE_DIRS = INSTALLATION_DIRS.map((dir) =>
  path.join(dir, 'node_modules')
);

export default class Install extends Command {
  static description = 'Installs node_modules throughout the project.';

  static flags = {
    help: flags.help({ char: 'h' }),
    delete: flags.boolean({ char: 'd', default: false }),
  };

  async run() {
    const { flags } = this.parse(Install);

    if (flags.delete) {
      this.log('🦑  deleting node_modules');
      NODE_MODULE_DIRS.map((dir) => path.join(dir, 'node_modules')).forEach(
        (dir) =>
          rimraf(dir, (err) => {
            if (err) {
              this.log(err.toString());
            }
          })
      );
    }

    this.log('🦑  installing node_modules');
    INSTALLATION_DIRS.forEach((cwd) => spawn('yarn', { cwd }));
  }
}
