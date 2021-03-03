const { task, desc, namespace } = require('jake');
const { spawn } = require('child_process');
const http = require('http');
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

namespace('tsc', () => {
  desc('typechecks the api project');
  task('api', ['install:api'], async () => {
    const WATCH = env('WATCH', 'true') === 'true';

    const tsc = yarn(['tsc', '--noEmit', WATCH ? '--watch' : ''].filter(identity), {
      stdio: 'inherit',
      cwd: 'api',
    });
    process.on('SIGINT', tsc.process.kill);
    await tsc.promise;
  });

  desc('typechecks the web project');
  task('web', ['install:web'], async () => {
    const WATCH = env('WATCH', 'true') === 'true';

    const tsc = yarn(['tsc', '--noEmit', WATCH ? '--watch' : ''].filter(identity), {
      stdio: 'inherit',
      cwd: 'web',
    });
    process.on('SIGINT', tsc.process.kill);
    await tsc.promise;
  });
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

desc('generates graphql types for each project');
task('typegen', [], async () => {
  const GRAPHQL_HOSTNAME = env('GRAPHQL_HOSTNAME', 'localhost');
  const GRAPHQL_PORT = env('GRAPHQL_PORT', '3000');
  const MAX_WAIT_MS = parseInt(env('MAX_WAIT_MS', '1200000'), 10); // 2 minutes

  if (isNaN(MAX_WAIT_MS)) {
    throw new Error('MAX_WAIT_MS env var is not a number');
  }
  if (MAX_WAIT_MS < 0) {
    throw new Error('MAX_WAIT_MS env var must be a positive number');
  }

  const isServerUp = () => {
    return new Promise((resolve) => {
      const req = http.request(
        {
          hostname: GRAPHQL_HOSTNAME,
          port: GRAPHQL_PORT,
          path: '/health',
          method: 'GET',
        },
        (res) => {
          resolve(res.statusCode === 200);
        }
      );

      req.on('error', () => {
        resolve(false);
      });

      req.end();
    });
  };

  const generateGraphqlTypes = async () => {
    const typegenApi = yarn(['typegen'], { cwd: 'api' });
    const typegenWeb = yarn(['typegen'], { cwd: 'web' });
    await Promise.all([typegenApi.promise, typegenWeb.promise]);
  };

  const waitForServer = async () => {
    const start = new Date();

    const getElapsedTimeMs = () => {
      const now = new Date();
      return now.getTime() - start.getTime();
    };

    const wait = (ms) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };

    process.stdout.write('waiting for graphql.');

    while (getElapsedTimeMs() < MAX_WAIT_MS) {
      process.stdout.write('.');

      const isReady = await isServerUp();
      if (isReady) {
        process.stdout.write('\n');
        log('graphql is up');
        return;
      }

      await wait(1000);
    }

    throw new Error('graphql never came up');
  };

  let up = undefined;
  const wasServerUp = await isServerUp();
  try {
    if (wasServerUp) {
      log('server already up');
    } else {
      log('temporarily starting server');
      up = dockerCompose(['up', '--detach'], { cwd: 'api' });
      await up.promise;
      await waitForServer();
    }

    await generateGraphqlTypes();
  } finally {
    // only kill the up process if it was created
    up && up.process.kill();

    if (!wasServerUp) {
      const down = dockerCompose(['down'], { cwd: 'api', stdio: 'inherit' });
      await down.promise;
    }
  }
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
  task('all', ['test:api', 'test:web'], noop);

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

desc('brings down all the projects');
task('down', [], async () => {
  const apiDown = dockerCompose(['-f', './docker-compose.yml', 'down'], { cwd: 'api' });
  const apiTestDown = dockerCompose(['-f', './docker-compose.test.yml', 'down'], { cwd: 'api' });
  await Promise.all([apiDown.promise, apiTestDown.promise]);
});
