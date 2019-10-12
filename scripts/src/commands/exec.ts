import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';

export default class Exec extends Command {
  static description = 'Runs docker-compose exec on an running container.';

  static strict = false;

  static flags = {
    help: flags.help({ char: 'h' }),
    service: flags.string({
      char: 's',
      required: true,
      description: 'service name',
    }),
  };

  static args = [{ name: 'cmd', required: true }];

  async run() {
    const { flags, args } = this.parse(Exec);
    execSync(`docker-compose exec ${flags.service} bash -c "${args.cmd}"`, {
      stdio: 'inherit',
    });
  }
}
