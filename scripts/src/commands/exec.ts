import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';

export default class Exec extends Command {
  static description = 'Runs docker-compose exec on an running container.';

  static strict = false;

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [
    { name: 'service', required: true },
    { name: 'cmd', required: true },
  ];

  async run() {
    const { argv } = this.parse(Exec);
    const [service, ...cmdv] = argv;
    const cmd = cmdv.join(' ');
    this.log(`exec '${cmd}' on ${service}:`);
    execSync(`docker-compose exec ${service} bash -c "${cmd}"`, {
      stdio: 'inherit',
    });
  }
}
