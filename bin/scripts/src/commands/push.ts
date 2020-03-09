import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util';

export default class Push extends Command {
  static description = 'describe the command here';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'service', options: ['server', 'web', 'e2e'] }];

  async run() {
    const { args } = this.parse(Push);

    execSync(`./bin/ss build ${args.service}`, {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });
    execSync(
      `aws ecr get-login --no-include-email --region us-east-1 | awk '{printf $6}' | docker login -u AWS --password-stdin 735208443400.dkr.ecr.us-east-1.amazonaws.com/ss-${args.service}`,
      { stdio: 'inherit' }
    );
    execSync(
      `docker tag ss-server:latest 735208443400.dkr.ecr.us-east-1.amazonaws.com/ss-${args.service}:latest`,
      { stdio: 'inherit' }
    );
    execSync(
      `docker push 735208443400.dkr.ecr.us-east-1.amazonaws.com/ss-${args.service}:latest`,
      { stdio: 'inherit' }
    );
    execSync(
      `docker rmi 735208443400.dkr.ecr.us-east-1.amazonaws.com/ss-${args.service}:latest`,
      { stdio: 'inherit' }
    );
  }
}
