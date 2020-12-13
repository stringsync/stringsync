import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { getDockerComposeFile } from '../util';
import { DOCKER_PATH, ROOT_PATH } from '../util/constants';

export default class Test extends Command {
  static description = 'Run all of the StringSync tests.';

  static flags = {
    watch: flags.boolean({ char: 'w', default: false }),
    coverage: flags.boolean({ char: 'c', default: false }),
  };

  static args = [
    {
      name: 'project',
      required: true,
      options: ['api', 'web'],
    },
    { name: 'cmd', required: false },
  ];

  async run() {
    const { flags, args, argv } = this.parse(Test);

    execSync(['./bin/ss', 'build', '-t'].join(' '), {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });

    let exit = 0;
    try {
      execSync(
        [
          'docker-compose',
          '-f',
          getDockerComposeFile(args.project),
          '-p',
          args.project,
          'run',
          '--rm',
          'test',
          'yarn',
          `test:${args.project}`,
          '--runInBand',
          `--watchAll=${flags.watch}`,
          flags.coverage ? '--collectCoverage' : '',
          ...argv.slice(1), // the first arg is project
        ]
          .filter((part) => part)
          .join(' '),
        {
          cwd: DOCKER_PATH,
          stdio: 'inherit',
        }
      );
    } catch (e) {
      exit = 1;
    }

    execSync(['./bin/ss', 'down', args.project].join(' '), {
      cwd: ROOT_PATH,
      stdio: 'inherit',
    });

    this.exit(exit);
  }
}
