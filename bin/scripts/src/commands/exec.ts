import { Command, flags } from '@oclif/command';
import { spawn } from 'child_process';
import { DOCKER_PATH, getDockerComposeFile, Project, PROJECT_ARG } from '../util';

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
      [
        '-f',
        getDockerComposeFile(project as Project),
        '-p',
        project,
        'exec',
        service,
        'bash',
        '-c',
        cmdv.join(' '),
      ].filter((arg) => arg),
      {
        cwd: DOCKER_PATH,
        stdio: 'inherit',
      }
    );
  }
}
