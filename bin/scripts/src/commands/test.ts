import { Command, flags } from '@oclif/command';
import { buildDockerImageSync } from '../util/buildDockerImageSync';
import { ROOT_PATH } from '../util/constants';
import { execSync } from 'child_process';
import { cmd } from '../util/cmd';

export default class Test extends Command {
  static description = 'describe the command here';

  static flags = {
    watch: flags.boolean({ char: 'w', default: false }),
  };

  static args = [
    { name: 'service', required: true, options: ['server', 'web'] },
  ];

  async run() {
    const { args, flags } = this.parse(Test);

    const dockerComposeFile = `docker-compose.${args.service}.test.yml`;

    buildDockerImageSync({
      imageTagName: 'ss-root:latest',
      dockerfilePath: 'Dockerfile',
      dockerContextPath: '.',
      cwd: ROOT_PATH,
    });
    execSync(`docker-compose -f ${dockerComposeFile} build`, {
      stdio: 'inherit',
      cwd: ROOT_PATH,
    });

    let exit = 0;
    try {
      execSync(
        cmd(
          'docker-compose',
          '-f',
          dockerComposeFile,
          'run',
          '--rm',
          `test-${args.service}`,
          'yarn',
          'run',
          'test',
          `--watchAll=${flags.watch}`
        ),
        {
          stdio: 'inherit',
          cwd: ROOT_PATH,
        }
      );
    } catch (e) {
      exit = 1;
    }

    execSync(`./bin/ss down ${dockerComposeFile}`, {
      stdio: 'inherit',
      cwd: ROOT_PATH,
    });
    this.exit(exit);
  }
}
