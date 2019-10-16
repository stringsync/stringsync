import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';

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

    const cmd = [
      'docker-compose',
      'exec',
      flags.psuedoTty ? '-T' : '',
      service,
      'bash',
      '-c',
      `"${cmdv.join(' ')}"`,
    ]
      .filter((str) => str.length > 0)
      .join(' ');

    this.log(`exec '${cmd}' on ${service}:`);
    execSync(cmd, { stdio: 'inherit' });
  }
}
