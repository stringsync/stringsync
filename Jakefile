const { task, desc, namespace } = require('jake');
const { spawn } = require('child_process');
const chalk = require('chalk');

const env = (name, fallback = undefined) => {
  const val = process.env[name];
  if (typeof val === 'undefined') {
    if (typeof fallback === 'undefined') {
      throw new Error(`env variable is not defined with no fallback: ${name}`);
    } else {
      return fallback;
    }
  }
  return val;
};

const log = (msg) => console.log(`jake: ${msg}`);

const noop = () => undefined;

const DEFAULT_CMD_OPTS = { cwd: __dirname, stdio: 'ignore', onSuccess: noop, onFailure: noop };

const cmd = (command) => {
  let isCommandChecked = false;
  let isCommandAvailable = false;

  return async (args, opts) => {
    opts = { ...DEFAULT_CMD_OPTS, ...opts };
    const VERBOSE = env('VERBOSE', 'false') === 'true';
    const QUIET = env('VERBOSE', 'false') === 'true';

    if (VERBOSE && QUIET) {
      throw new Error('cannot specify VERBOSE=true and QUIET=true env vars');
    }

    opts.stdio = VERBOSE ? 'inherit' : opts.stdio;
    opts.stdio = QUIET ? 'ignore' : opts.stdio;

    if (!isCommandChecked) {
      await new Promise((resolve) => {
        const which = spawn('which', [command]);
        which.on('close', (exitCode) => {
          isCommandAvailable = exitCode === 0;
          isCommandChecked = true;
          resolve();
        });
      });
    }
    if (!isCommandAvailable) {
      throw new Error(`command not available: \`${command}\``);
    }

    await new Promise((resolve, reject) => {
      const cmdStr = [command, ...args].join(' ');
      log(chalk.yellow(cmdStr));

      const child = spawn(command, args, { cwd: opts.cwd, stdio: opts.stdio });
      child.on('close', (exitCode) => {
        if (exitCode === 0) {
          opts.onSuccess();
          resolve();
        } else {
          opts.onFailure();
          reject(new Error(`nonzero exit code: ${exitCode}`));
        }
      });
      child.on('error', (err) => {
        opts.onFailure();
        reject(err);
      });
    });
  };
};

const yarn = cmd('yarn');

const dockerCompose = cmd('docker-compose');

const docker = cmd('docker');

desc('brings up all projects');
task('dev', ['build:api', 'install:web'], async () => {
  // Ctrl+C is used to kill the yarn start subprocess.
  // Do nothing in the task so it can teardown gracefully.
  process.on('SIGINT', noop);

  try {
    const api = dockerCompose(['up', '--detach'], { cwd: 'api' });
    const web = yarn(['start'], { cwd: 'web', stdio: 'inherit' });
    await Promise.all([api, web]);
  } catch (e) {
    // noop, who cares the dev process is down
  } finally {
    await dockerCompose(['down'], { cwd: 'api', stdio: 'inherit' });
  }
});

namespace('install', () => {
  desc('installs api dependencies');
  task('api', [], async () => {
    await yarn([], { cwd: 'api' });
  });

  desc('installs web dependencies');
  task('web', async () => {
    await yarn([], { cwd: 'web' });
  });
});

namespace('db', () => {
  desc('migrates the database');
  task('migrate', ['install:api'], async () => {
    env('DB_NAME');
    env('DB_USERNAME');
    env('DB_PASSWORD');
    env('DB_HOST');
    env('DB_PORT');

    yarn(['migrate'], { cwd: 'api' });
  });
});

namespace('build', () => {
  desc('builds the stringsync docker image');
  task('api', [], async () => {
    const DOCKER_TAG = env('DOCKER_TAG', 'latest');

    await docker(['build', '-t', `stringsync:${DOCKER_TAG}`, '.'], { cwd: 'api' });
  });

  desc('builds the stringsync production build');
  task('web', ['install:web'], async () => {
    await yarn(['build'], { cwd: 'web' });
  });
});

namespace('test', () => {
  desc('tests each project');
  task('all', ['test:api', 'test:web'], { concurrency: 2 }, noop);

  desc('tests the api project');
  task('api', ['build:api'], async () => {
    const WATCH = env('WATCH', 'false') === 'true';
    const CI = env('CI', 'false') === 'true';

    const runTests = async () => {
      const onSuccess = () => {
        log(chalk.green('api tests succeeded'));
      };
      const onFailure = () => {
        log(chalk.red('api tests failed'));
      };
      await dockerCompose(
        [
          '-f',
          './api/docker-compose.test.yml',
          'run',
          '--rm',
          'test',
          'yarn',
          'test',
          `--watchAll=${WATCH}`,
          CI ? '--no-colors' : '--colors',
        ],
        { onSuccess, onFailure }
      );
    };

    const cleanupTests = async () => {
      await dockerCompose(['-f', './api/docker-compose.test.yml', 'down', '--remove-orphans']);
    };

    try {
      await runTests();
    } finally {
      await cleanupTests();
    }
  });

  desc('tests the web project');
  task('web', ['install:web'], async () => {
    const WATCH = env('WATCH', 'false') === 'true';
    const CI = env('CI', 'false') === 'true';

    const onSuccess = () => {
      log(chalk.green('web tests succeeded'));
    };
    const onFailure = () => {
      log(chalk.red('web tests failed'));
    };
    await yarn(['test', `--watchAll=${WATCH}`, CI ? '--no-colors' : '--colors'], { cwd: 'web', onSuccess, onFailure });
  });
});
