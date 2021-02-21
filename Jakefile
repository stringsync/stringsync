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

const identity = (x) => x;

const DEFAULT_CMD_OPTS = { cwd: __dirname, stdio: 'ignore' };

const cmd = (command) => (args, opts) => {
  opts = { ...DEFAULT_CMD_OPTS, ...opts };
  const VERBOSE = env('VERBOSE', 'false') === 'true';
  const QUIET = env('VERBOSE', 'false') === 'true';

  if (VERBOSE && QUIET) {
    throw new Error('cannot specify VERBOSE=true and QUIET=true env vars');
  }

  opts.stdio = VERBOSE ? 'inherit' : opts.stdio;
  opts.stdio = QUIET ? 'ignore' : opts.stdio;

  const process = spawn(command, args, { cwd: opts.cwd, stdio: opts.stdio });

  const promise = new Promise((resolve, reject) => {
    const cmdStr = [command, ...args].join(' ');
    log(chalk.yellow(cmdStr));

    process.on('close', (exitCode) => {
      // exitCode === null means the process was killed
      if (exitCode === 0 || exitCode === null) {
        resolve();
      } else {
        reject(new Error(`nonzero exit code: ${exitCode}`));
      }
    });
    process.on('error', (err) => {
      reject(err);
    });
  });

  return { process, promise };
};

const yarn = cmd('yarn');

const dockerCompose = cmd('docker-compose');

const docker = cmd('docker');

desc('brings up all projects');
task('dev', ['build:api', 'install:web'], async () => {
  try {
    const api = dockerCompose(['up', '--detach'], { cwd: 'api' });
    const web = yarn(['start'], { cwd: 'web', stdio: 'inherit' });
    process.on('SIGINT', web.process.kill);
    await Promise.all([api.promise, web.promise]);
  } finally {
    const down = dockerCompose(['down'], { cwd: 'api', stdio: 'inherit' });
    await down.promise;
  }
});

desc('typechecks all projects');
task('typecheck', ['install:api', 'install:web'], async () => {
  const WATCH = env('WATCH', 'true') === 'true';

  const tsc = yarn(['tsc', '--noEmit', '-p', 'api', '-p', 'web', WATCH ? '--watch' : ''].filter(identity), {
    stdio: 'inherit',
  });
  await tsc.promise;
});

namespace('install', () => {
  desc('installs api dependencies');
  task('api', [], async () => {
    const install = yarn([], { cwd: 'api' });
    await install.promise;
  });

  desc('installs web dependencies');
  task('web', async () => {
    const install = yarn([], { cwd: 'web' });
    await install.promise;
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

    const migrate = yarn(['migrate'], { cwd: 'api' });
    await migrate.promise;
  });
});

namespace('build', () => {
  desc('builds the stringsync docker image');
  task('api', [], async () => {
    const DOCKER_TAG = env('DOCKER_TAG', 'latest');

    const build = docker(['build', '-t', `stringsync:${DOCKER_TAG}`, '.'], { cwd: 'api' });
    await build.promise;
  });

  desc('builds the stringsync production build');
  task('web', ['install:web'], async () => {
    const build = yarn(['build'], { cwd: 'web', stdio: 'inherit' });
    await build.promise;
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
      const test = dockerCompose(
        [
          '-f',
          './docker-compose.test.yml',
          'run',
          '--rm',
          'test',
          'yarn',
          'test',
          `--watchAll=${WATCH}`,
          CI ? '--no-colors' : '--colors',
        ],
        { stdio: 'inherit', cwd: 'api' }
      );
      try {
        await test.promise;
        log(chalk.green('api tests succeeded'));
      } catch (err) {
        log(chalk.red('api tests failed'));
        throw err;
      }
    };

    const cleanupTests = async () => {
      const down = dockerCompose(['-f', './docker-compose.test.yml', 'down', '--remove-orphans'], { cwd: 'api' });
      await down.promise;
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

    const test = yarn(['test', `--watchAll=${WATCH}`, CI ? '--no-colors' : '--colors'], {
      cwd: 'web',
      stdio: 'inherit',
    });
    try {
      await test.promise;
      log(chalk.green('web tests succeeded'));
    } catch (err) {
      log(chalk.red('web tests failed'));
      throw err;
    }
  });
});
