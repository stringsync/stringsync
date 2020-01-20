import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { getDockerComposeFile, PROJECTS, cmd, ROOT_PATH } from '../util';

export default class Exec extends Command {
  static description = 'Follows the logs for a particular service.';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [
    { name: 'project', required: true, options: PROJECTS },
    { name: 'service', required: false, default: '' },
  ];

  async run() {
    const { args } = this.parse(Exec);
    execSync(
      cmd(
        'docker-compose',
        '-f',
        getDockerComposeFile(args.project),
        '-p',
        args.project,
        'logs',
        '-f',
        args.service
      ),
      {
        stdio: 'inherit',
        cwd: ROOT_PATH,
      }
    );
  }
}
