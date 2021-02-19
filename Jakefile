const { task, desc, namespace } = require('jake');
const { spawn } = require('child_process');

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

namespace('build', () => {
  desc('builds the stringsync docker image');
  task('api', [], async () => {
    const DOCKER_TAG = env('DOCKER_TAG', 'latest');

    await new Promise((resolve) => {
      const docker = spawn('docker', ['build', '-t', `stringsync:${DOCKER_TAG}`, './api']);
      docker.on('close', resolve);
    });
  });
});

namespace('test', () => {
  desc('tests the api project');
  task('api', ['build:api'], async () => {
    const WATCH = env('WATCH', 'false') === 'true';

    const runTests = async () => {
      await new Promise((resolve, reject) => {
        const dockerCompose = spawn(
          'docker-compose',
          ['-f', './api/docker-compose.test.yml', 'run', '--rm', 'test', 'yarn', 'test', `--watchAll=${WATCH}`],
          { stdio: 'inherit' }
        );
        dockerCompose.on('close', (exitCode) => {
          if (exitCode === 0) {
            console.log('tests succeeded');
            resolve();
          } else {
            console.log('tests failed');
            reject();
          }
        });
      });
    };

    const cleanupTests = async () => {
      await new Promise((resolve) => {
        const dockerCompose = spawn('docker-compose', [
          '-f',
          './api/docker-compose.test.yml',
          'down',
          '--remove-orphans',
        ]);
        dockerCompose.on('close', resolve);
      });
    };

    try {
      await runTests();
    } finally {
      await cleanupTests();
    }
  });
});
