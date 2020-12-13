import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util';

export default class Build extends Command {
  static description = 'Builds the stringsync image';

  static flags = {
    help: flags.help({ char: 'h' }),
    tag: flags.string({ default: 'latest' }),
    dev: flags.boolean({ char: 'd', default: false }),
    test: flags.boolean({ char: 't', default: false }),
    prod: flags.boolean({ char: 'p', default: false }),
  };

  async run() {
    const { flags } = this.parse(Build);

    this.build('Dockerfile.base', 'stringsync-base', flags.tag);

    if (flags.test) {
      this.build('Dockerfile.test', 'stringsync-test', flags.tag);
    }
    if (flags.dev) {
      this.build('Dockerfile.dev', 'stringsync-dev', flags.tag);
    }
    if (flags.prod) {
      this.build('Dockerfile.prod', 'stringsync', flags.tag);
    }
  }

  private build(dockerfile: string, image: string, tag: string) {
    execSync(`docker build . -f ./docker/${dockerfile} -t ${image}:${tag}`, {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });
  }
}
