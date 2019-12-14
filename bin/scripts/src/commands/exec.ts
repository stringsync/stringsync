import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { cmd } from '../util/cmd';

export default class Exec extends Command {
  static description = 'Runs docker-compose exec on an running container.';

  static strict = false;

  static flags = {
    help: flags.help({ char: 'h' }),
    psuedoTty: flags.boolean({ char: 'T' }),
  };

  static args = [
    { name: 'service', required: true },
    { name: 'cmd', required: true },
  ];

  async run() {
    const { argv, flags } = this.parse(Exec);
    const [service, ...cmdv] = argv;

    const execCmd = cmd(
      'docker-compose',
      'exec',
      flags.psuedoTty ? '-T' : '',
      service,
      'bash',
      '-c',
      `"${cmdv.join(' ')}"`
    );

    this.log(`exec '${execCmd}' on ${service}:`);
    execSync(execCmd, { stdio: 'inherit' });
  }
}
