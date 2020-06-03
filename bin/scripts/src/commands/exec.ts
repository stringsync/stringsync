import { Command, flags } from '@oclif/command';
import { getDockerComposeFile, Project, PROJECT_ARG, ROOT_PATH } from '../util';
import { spawn } from 'child_process';

export default class Exec extends Command {
  static description = 'Runs docker-compose exec on an running container.';

  static strict = false;

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [
    { ...PROJECT_ARG, required: true },
    { name: 'service', required: true },
    { name: 'cmd', required: true },
  ];

  async run() {
    const { argv } = this.parse(Exec);
    const [project, service, ...cmdv] = argv;

    spawn(
      'docker-compose',
      ['-f', getDockerComposeFile(project as Project), 'exec', service, 'bash', '-c', cmdv.join(' ')].filter(
        (arg) => arg
      ),
      {
        cwd: ROOT_PATH,
        stdio: 'inherit',
      }
    );
  }
}
