import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';

export default class Sql extends Command {
  static description = 'Runs sequelize commands on a running server service.';

  static strict = false;

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'cmd', required: true }];

  async run() {
    const { argv } = this.parse(Sql);
    // sequelize can only run one command at a time
    for (const cmd of argv) {
      execSync(`ss exec server yarn sequelize ${cmd}`, {
        stdio: 'inherit',
      });
    }
  }
}
