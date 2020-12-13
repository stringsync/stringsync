import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util';

export default class Build extends Command {
  static description = 'Builds the stringsync image';

  static flags = {
    help: flags.help({ char: 'h' }),
    tag: flags.string({ char: 't', default: 'latest' }),
    prod: flags.boolean({ char: 'p', default: false }),
    dev: flags.boolean({ char: 'd', default: false }),
  };

  async run() {
    const { flags } = this.parse(Build);

    this.buildBaseSync(flags.tag);

    if (flags.dev) {
      this.buildDevSync(flags.tag);
    }
    if (flags.prod) {
      this.buildProdSync(flags.tag);
    }
  }

  private buildBaseSync(tag: string) {
    execSync(`docker build . -f ./docker/Dockerfile.base -t stringsync-base:${tag}`, {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });
  }

  private buildDevSync(tag: string) {
    execSync(`docker build . -f ./docker/Dockerfile.dev -t stringsync-dev:${tag}`, {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });
  }

  private buildProdSync(tag: string) {
    execSync(`docker build . -f ./docker/Dockerfile.prod -t stringsync:${tag}`, {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });
  }
}
