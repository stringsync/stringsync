import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import {
  ROOT_PATH,
  PROJECTS,
  buildDockerImageSync,
  cmd,
  getDockerComposeFile,
} from '../util';

export default class Up extends Command {
  static description = 'Spins up a development environment';

  static flags = {
    help: flags.help({ char: 'h' }),
    attach: flags.boolean({ char: 'a' }),
  };

  static args = [
    { name: 'project', required: false, default: 'main', options: PROJECTS },
  ];

  async run() {
    const { flags, args } = this.parse(Up);

    buildDockerImageSync({
      imageTagName: 'ss-root:latest',
      dockerfilePath: 'Dockerfile',
      dockerContextPath: '.',
      cwd: ROOT_PATH,
    });

    execSync(
      cmd(
        'docker-compose',
        '-f',
        getDockerComposeFile(args.project),
        '-p',
        args.project,
        'up',
        '--build',
        flags.attach ? '' : '-d'
      ),
      {
        stdio: 'inherit',
        cwd: ROOT_PATH,
      }
    );
  }
}
