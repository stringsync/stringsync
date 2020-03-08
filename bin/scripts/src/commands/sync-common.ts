import { Command, flags } from '@oclif/command';
import { ROOT_PATH } from '../util';
import rimraf from 'rimraf';
import { spawn } from 'child_process';

const SRC_DIR = './common';
const DST_DIRS = ['./server/src/common', './web/src/common'];

export default class SyncCommon extends Command {
  static description = 'Copies the common dir to all the projects.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(SyncCommon);

    for (const dstDir of DST_DIRS) {
      rimraf(dstDir, (err) => {
        if (err) {
          console.error(err);
        }
      });
      spawn('cp', ['-R', SRC_DIR, dstDir], {
        cwd: ROOT_PATH,
        stdio: 'inherit',
      });
      this.log(`updated: ${dstDir}`);
    }
  }
}
