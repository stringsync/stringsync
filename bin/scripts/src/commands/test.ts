import { Command, flags } from '@oclif/command';
import { ROOT_PATH } from '../util/constants';
import { execSync } from 'child_process';
import { getDockerComposeFile } from '../util';

export default class Test extends Command {
  static description = 'Run all of the StringSync tests.';

  static flags = {
    watch: flags.boolean({ char: 'w', default: false }),
  };

  async run() {
    const { flags } = this.parse(Test);
    const project = 'test';

    execSync(['./bin/ss', 'build'].join(' '), {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });

    let exit = 0;
    try {
      execSync(
        [
          'docker-compose',
          '-f',
          getDockerComposeFile(project),
          'run',
          '--rm',
          'test',
          'yarn',
          'test',
          '--runInBand',
          `--watchAll=${flags.watch}`,
        ].join(' '),
        {
          cwd: ROOT_PATH,
          stdio: 'inherit',
        }
      );
    } catch (e) {
      exit = 1;
    }

    execSync(['./bin/ss', 'down', project].join(' '), {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });

    this.exit(exit);
  }
}
