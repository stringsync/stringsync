import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { getDockerComposeFile } from '../util';
import { DOCKER_PATH, ROOT_PATH } from '../util/constants';

const bashC = (...parts: string[]) => {
  return `bash -c "${parts.filter((part) => part).join(' ')}"`;
};

export default class Test extends Command {
  static description = 'Run all of the StringSync tests.';

  static flags = {
    watch: flags.boolean({ char: 'w', default: false }),
    coverage: flags.boolean({ char: 'c', default: false }),
    ci: flags.boolean({ default: false }),
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

    if (flags.ci && flags.watch) {
      this.log('cannot specify ci=true and watch=true');
      this.exit(1);
    }

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
          bashC(
            flags.ci ? 'CI=true' : '',
            flags.ci ? `JEST_SUITE_NAME=${args.project}` : '',
            flags.ci ? 'JEST_JUNIT_SUITE_NAME="{displayName}"' : '',
            flags.ci ? 'JEST_JUNIT_CLASSNAME="{classname}"' : '',
            flags.ci ? `JEST_JUNIT_OUTPUT_NAME="junit.${args.project}.xml"` : '',
            flags.ci ? `JEST_JUNIT_OUTPUT_DIR="${args.project === 'web' ? '../../reports' : 'reports'}"` : '',
            'yarn',
            `test:${args.project}`,
            '--runInBand',
            `--watchAll=${flags.watch}`,
            flags.coverage ? '--collectCoverage' : '',
            flags.ci ? '--reporters=jest-junit' : '',
            ...argv.slice(1) // the first arg is project
          ),
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
