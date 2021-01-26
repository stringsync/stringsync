import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util';

export default class Build extends Command {
  static description = 'build docker images for stringsync';

  static flags = {
    help: flags.help({ char: 'h' }),
    tag: flags.string({ default: 'latest' }),
    dev: flags.boolean({ char: 'd', default: false }),
    test: flags.boolean({ char: 't', default: false }),
    prod: flags.boolean({ char: 'p', default: false }),
    cmd: flags.boolean({ char: 'c', default: false }),
    cacheFrom: flags.string({ default: '' }),
  };

  async run() {
    const { flags } = this.parse(Build);

    this.build('Dockerfile.base', 'stringsync-base', flags.tag, flags.cacheFrom);

    if (flags.test) {
      this.build('Dockerfile.test', 'stringsync-test', flags.tag, flags.cacheFrom);
    }
    if (flags.dev) {
      this.build('Dockerfile.dev', 'stringsync-dev', flags.tag, flags.cacheFrom);
    }
    if (flags.prod) {
      this.build('Dockerfile.prod', 'stringsync', flags.tag, flags.cacheFrom);
    }
    if (flags.cmd) {
      this.build('Dockerfile.cmd', 'stringsync-cmd', flags.tag, flags.cacheFrom);
    }
  }

  private build(dockerfile: string, image: string, tag: string, cacheFrom: string) {
    execSync(
      [
        'docker',
        'build .',
        `-f ./docker/${dockerfile}`,
        `-t ${image}:${tag}`,
        cacheFrom ? `--cache-from ${cacheFrom}` : '',
      ]
        .filter((part) => part)
        .join(' '),
      {
        cwd: ROOT_PATH,
        stdio: 'inherit',
      }
    );
  }
}
