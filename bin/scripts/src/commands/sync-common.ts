import { Command, flags } from '@oclif/command';
import { execSyncFromRootPath, cmd } from '../util';

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
      execSyncFromRootPath(cmd('rm', '-rf', dstDir));
      execSyncFromRootPath(cmd('cp', '-R', SRC_DIR, dstDir));
      this.log(`updated: ${dstDir}`);
    }
  }
}
