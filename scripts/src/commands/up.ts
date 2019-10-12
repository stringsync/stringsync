import { Command, flags } from '@oclif/command';
import { spawn, execSync } from 'child_process';
import { buildDockerImageSync } from '../util/buildDockerImage';
import { ROOT_PATH } from '../util/constants';

export default class Up extends Command {
  static description = 'Spins up a development environment';

  static flags = {
    help: flags.help({ char: 'h' }),
    attach: flags.boolean({ char: 'a' }),
  };

  async run() {
    const { flags } = this.parse(Up);
    const cmd = 'docker-compose';
    const args = ['up', '--build'];

    if (!flags.attach) {
      args.push('-d'); // detach mode
    }

    buildDockerImageSync({
      imageTagName: 'ss-root:latest',
      dockerfilePath: 'Dockerfile',
      dockerContextPath: '.',
      cwd: ROOT_PATH,
    });

    execSync([cmd, ...args].join(' '), { stdio: 'inherit' });
  }
}
