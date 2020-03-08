import { Command, flags } from '@oclif/command';
import { getDockerComposeFile, PROJECT_ARG, ROOT_PATH } from '../util';
import { spawn } from 'child_process';

export default class Exec extends Command {
  static description = 'Follows the logs for a particular service.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [
    { ...PROJECT_ARG, required: true },
    { name: 'service', required: false, default: '' },
  ];

  async run() {
    const { args } = this.parse(Exec);

    spawn(
      'docker-compose',
      [
        '-f',
        getDockerComposeFile(args.project),
        '-p',
        args.project,
        'logs',
        '-f',
        args.service,
      ],
      { cwd: ROOT_PATH, stdio: 'inherit' }
    );
  }
}
