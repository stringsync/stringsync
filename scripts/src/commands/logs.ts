import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';

export default class Exec extends Command {
  static description = 'Follows the logs for a particular service.';

  static flags = {
    help: flags.help({ char: 'h' }),
    tail: flags.integer({ default: 1000 }),
  };

  static args = [{ name: 'service', required: true }];

  async run() {
    const { flags, args } = this.parse(Exec);
    execSync(`docker-compose logs -f --tail=${flags.tail} ${args.service}`, {
      stdio: 'inherit',
    });
  }
}
