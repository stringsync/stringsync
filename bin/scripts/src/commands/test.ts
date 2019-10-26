import { Command, flags } from '@oclif/command';
import { buildDockerImageSync } from '../util/buildDockerImageSync';
import { ROOT_PATH } from '../util/constants';
import { execSync } from 'child_process';

export default class Test extends Command {
  static description = 'describe the command here';

  static flags = {
    watch: flags.boolean({ char: 'w' }),
  };

  async run() {
    const { flags } = this.parse(Test);

    buildDockerImageSync({
      imageTagName: 'ss-root:latest',
      dockerfilePath: 'Dockerfile',
      dockerContextPath: '.',
      cwd: ROOT_PATH,
    });
    execSync(`docker-compose -f docker-compose.test.yml build`, {
      stdio: 'inherit',
      cwd: ROOT_PATH,
    });

    let exit = 0;
    try {
      execSync(
        `docker-compose -f docker-compose.test.yml run --rm test-server yarn run test${
          flags.watch ? ' --watchAll' : ''
        }`,
        {
          stdio: 'inherit',
          cwd: ROOT_PATH,
        }
      );
    } catch (e) {
      exit = 1;
    }

    execSync(`docker-compose -f docker-compose.test.yml down --volumes`, {
      stdio: 'inherit',
      cwd: ROOT_PATH,
    });
    this.exit(exit);
  }
}
