import { Command, flags } from '@oclif/command';
import { spawn } from 'child_process';
import { DOCKER_PATH, getDockerComposeFile, PROJECT_ARG } from '../util';

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
      ['-p', args.project, '-f', getDockerComposeFile(args.project), 'logs', '-f', args.service].filter((arg) => arg),
      { cwd: DOCKER_PATH, stdio: 'inherit' }
    );
  }
}
