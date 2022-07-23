import path from 'path';
import * as aws from './scripts/aws';
import { cleanup } from './scripts/cleanup';
import * as constants from './scripts/constants';
import { getDbEnv } from './scripts/db';
import * as docker from './scripts/docker';
import { Env } from './scripts/Env';
import * as graphql from './scripts/graphql';
import * as test from './scripts/test';
import { Project } from './scripts/types';
import { cmd, identity, log } from './scripts/util';

const { series, parallel } = require('gulp');

const BUMP = Env.string('BUMP');
const BRANCH = Env.string('BRANCH');
const CI = Env.boolean('CI');
const DB_USERNAME = Env.string('DB_USERNAME');
const DOCKER_COMPOSE_FILE = Env.string('DOCKER_COMPOSE_FILE');
const DOCKER_TAG = Env.string('DOCKER_TAG');
const DOCKERFILE = Env.string('DOCKERFILE');
const GRAPHQL_HOSTNAME = Env.string('GRAPHQL_HOSTNAME');
const GRAPHQL_PORT = Env.number('GRAPHQL_PORT');
const MAX_WAIT_MS = Env.number('MAX_WAIT_MS');
const REMOTE = Env.string('REMOTE');
const STACK_NAME = Env.string('STACK_NAME');
const WATCH = Env.boolean('WATCH');
const AWS_REGION = Env.string('AWS_REGION');
const NODE_ENV = Env.string('NODE_ENV');
const TAG = Env.string('TAG');

async function dev() {
  const composeFile = constants.DOCKER_COMPOSE_DEV_FILE;

  cleanup(() => docker.down(composeFile));
  await docker.up(composeFile);
  await docker.logs(composeFile);
}

async function fakeprod() {
  const composeFile = constants.DOCKER_COMPOSE_FAKE_PROD_FILE;

  cleanup(() => docker.down(composeFile));
  await docker.up(composeFile);
  await docker.logs(composeFile);
}

async function down() {
  await docker.down(constants.DOCKER_COMPOSE_FAKE_PROD_FILE);
}

async function typegen() {
  const hostname = GRAPHQL_HOSTNAME.getOrDefault('localhost');
  const port = GRAPHQL_PORT.getOrDefault(80);
  const maxWaitMs = MAX_WAIT_MS.getOrDefault(1200000); // 2 minutes

  if (maxWaitMs <= 0) {
    throw new TypeError('MAX_WAIT_MS must be greater than 0');
  }

  await graphql.typegen(hostname, port, maxWaitMs);
}

async function gensecrets() {
  const src = path.join(__dirname, 'templates', 'secrets.template.env');
  const dst = path.join(__dirname, 'env', 'secrets.env');
  await cmd('cp', ['-n', src, dst], { reject: false });
}

async function logs() {
  const composeFile = DOCKER_COMPOSE_FILE.getOrDefault(constants.DOCKER_COMPOSE_DEV_FILE);

  await docker.logs(composeFile);
}

async function deploy() {
  const BUMP_FLAGS = {
    PATCH: '--patch',
    MINOR: '--minor',
    MAJOR: '--major',
  };

  const bump = BUMP.getOrDefault('PATCH');
  const branch = BRANCH.getOrDefault('master');
  const remote = REMOTE.getOrDefault('aws');

  if (!(bump in BUMP_FLAGS)) {
    throw new TypeError(`BUMP must be one of: ${Object.keys(BUMP_FLAGS).join(', ')}, got: ${bump}`);
  }
  const bumpFlag = BUMP_FLAGS[bump as keyof typeof BUMP_FLAGS];

  log('bumping api version');
  await cmd('yarn', ['version', bumpFlag, '--no-git-tag-version', '--no-commit-hooks'], { cwd: Project.API });

  log('bumping web version');
  await cmd('yarn', ['version', bumpFlag, '--no-git-tag-version', '--no-commit-hooks'], { cwd: Project.WEB });

  log('committing version changes');
  const version = (
    await cmd('node', ['-e', `"process.stdout.write(require('./package.json').version);"`], {
      cwd: Project.API,
      shell: true,
      stdio: 'pipe',
    })
  ).stdout;
  await cmd('git', ['add', 'api/package.json', 'web/package.json']);
  await cmd('git', ['commit', '-m', `Bump app version to v${version}`]);
  await cmd('git', ['tag', '-a', `v${version}`, '-m', `Bump app version to v${version}`]);

  log('pushing to remotes');
  await cmd('git', ['push', 'origin']);
  await cmd('git', ['push', remote, `${branch}:master`]);
}

async function rollback() {
  const tag = TAG.get();
  const branch = BRANCH.getOrDefault('master');
  const remote = REMOTE.getOrDefault('aws');

  log('getting current version');
  const prevVersion = (
    await cmd('node', ['-e', `"process.stdout.write(require('./package.json').version);"`], {
      cwd: Project.API,
      shell: true,
      stdio: 'pipe',
    })
  ).stdout;

  // Leverage yarn to bump the version for us, so we don't have to deal with edge cases of all the semantic version
  // names.
  log('bumping version by a minor step');
  await cmd('yarn', ['version', '--minor', '--no-git-tag-version', '--no-commit-hooks'], { cwd: Project.API });

  log('getting next version');
  const nextVersion = (
    await cmd('node', ['-e', `"process.stdout.write(require('./package.json').version);"`], {
      cwd: Project.API,
      shell: true,
      stdio: 'pipe',
    })
  ).stdout;

  log('cleaning changes');
  await cmd('git', ['checkout', './package.json'], { cwd: Project.API });

  log(`getting commit of tag: ${tag}`);
  const commit = (await cmd('git', ['rev-list', '-n', '1', tag], { shell: true, stdio: 'pipe' })).stdout;

  log(`reverting all commits back to: ${commit}`);
  await cmd('git', ['revert', '--no-edit', '--no-commit', `${commit}..HEAD`]);

  log(`updating api version to: ${nextVersion}`);
  await cmd('yarn', ['version', '--no-git-tag-version', '--no-commit-hooks', '--new-version', `v${nextVersion}`], {
    cwd: Project.API,
  });

  log(`updating web version to: ${nextVersion}`);
  await cmd('yarn', ['version', '--no-git-tag-version', '--no-commit-hooks', '--new-version', `v${nextVersion}`], {
    cwd: Project.WEB,
  });

  log('committing version changes');
  await cmd('git', ['add', 'api/package.json', 'web/package.json']);
  await cmd('git', ['commit', '-m', `Rollback app version to v${prevVersion} as v${nextVersion}`]);
  await cmd('git', [
    'tag',
    '-a',
    `v${nextVersion}`,
    '-m',
    `Rollback app version to v${prevVersion} as v${nextVersion}`,
  ]);

  log('pushing to remotes');
  await cmd('git', ['push', 'origin']);
  await cmd('git', ['push', remote, `${branch}:master`]);
}

async function db() {
  const composeFile = DOCKER_COMPOSE_FILE.getOrDefault(constants.DOCKER_COMPOSE_DEV_FILE);
  const dbUsername = DB_USERNAME.getOrDefault('stringsync');

  await docker.db(composeFile, dbUsername);
}

async function redis() {
  const composeFile = DOCKER_COMPOSE_FILE.getOrDefault(constants.DOCKER_COMPOSE_DEV_FILE);
  await docker.redis(composeFile);
}

async function migrator() {
  const composeFile = DOCKER_COMPOSE_FILE.getOrDefault(constants.DOCKER_COMPOSE_DEV_FILE);
  await docker.migrator(composeFile);
}

async function tscapi() {
  const watch = WATCH.getOrDefault(true);

  await cmd('yarn', ['tsc', '--noEmit', watch ? '--watch' : ''].filter(identity), { cwd: Project.API });
}

async function tscweb() {
  const watch = WATCH.getOrDefault(true);

  await cmd('yarn', ['tsc', '--noEmit', watch ? '--watch' : ''].filter(identity), { cwd: Project.WEB });
}

async function installapi() {
  await cmd('yarn', [], { cwd: Project.API });
}

async function installweb() {
  await cmd('yarn', [], { cwd: Project.WEB });
}

async function installaws() {
  await cmd('yarn', [], { cwd: Project.AWS });
}

async function buildapp() {
  const dockerTag = DOCKER_TAG.getOrDefault('stringsync:latest');
  const dockerfile = DOCKERFILE.getOrDefault('Dockerfile');

  await docker.build(dockerfile, dockerTag);
}

async function buildnginx() {
  const ci = CI.getOrDefault(false);

  const dockerTag = 'stringsyncnginx:latest';
  const dockerfile = 'Dockerfile.nginx';

  await cmd('rm', ['-rf', 'build'], {
    cwd: Project.WEB,
  });

  await cmd('yarn', ['build'], {
    cwd: Project.WEB,
    env: ci
      ? undefined
      : {
          // Without this, building locally will fail.
          // https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported
          NODE_OPTIONS: '--openssl-legacy-provider',
        },
  });
  await docker.build(dockerfile, dockerTag);
}

async function extractReports() {
  log('making root reports dir');
  await cmd('mkdir', ['-p', 'reports']);

  log('copying project reports to root reports dir');
  const api = cmd('cp', ['-R', 'api/reports/*', 'reports'], { shell: true });
  const web = cmd('cp', ['-R', 'web/reports/*', 'reports'], { shell: true });
  await Promise.all([api, web]);
}

async function testapi() {
  const watch = WATCH.getOrDefault(false);
  const ci = CI.getOrDefault(false);

  await test.run(Project.API, ci, watch);
}

async function testweb() {
  const watch = WATCH.getOrDefault(false);
  const ci = CI.getOrDefault(false);

  await test.run(Project.WEB, ci, watch);
}

async function cdkdeploy() {
  await cmd('yarn', ['cdk', 'deploy', '--all'], { reject: false, cwd: Project.AWS });
}

async function admin() {
  const stackName = STACK_NAME.getOrDefault('stringsync');

  // download credentials
  const downloadKeyCommand = await aws.getStackOutputValue(stackName, 'AdminInstanceDownloadKeyCommand');
  await cmd('aws', downloadKeyCommand.split(' ').slice(1), { shell: true, reject: false });

  // ssh into instance
  const sshCommand = await aws.getStackOutputValue(stackName, 'AdminInstanceSshCommand');
  const [sshCmd, ...sshArgs] = sshCommand.split(' ');
  await cmd(sshCmd, sshArgs);
}

async function admindb() {
  const stackName = STACK_NAME.getOrDefault('stringsync');
  const awsRegion = AWS_REGION.getOrDefault('us-east-1');
  const nodeEnv = NODE_ENV.getOrDefault('production');

  const dbEnv = await getDbEnv(stackName, awsRegion);
  await cmd(
    'psql',
    [
      `--host=${dbEnv.DB_HOST}`,
      `--port=${dbEnv.DB_PORT}`,
      `--username=${dbEnv.DB_USERNAME}`,
      `--dbname=${dbEnv.DB_NAME}`,
    ],
    {
      env: { NODE_ENV: nodeEnv, PGPASSWORD: dbEnv.DB_PASSWORD },
    }
  );
}

async function adminmigrate() {
  const stackName = STACK_NAME.getOrDefault('stringsync');
  const awsRegion = AWS_REGION.getOrDefault('us-east-1');
  const nodeEnv = NODE_ENV.getOrDefault('production');

  const dbEnv = await getDbEnv(stackName, awsRegion);
  await cmd('yarn', ['migrate'], { env: { NODE_ENV: nodeEnv, ...dbEnv } });
}

exports['dev'] = series(buildapp, dev);
exports['fakeprod'] = series(buildnginx, buildapp, fakeprod);
exports['down'] = down;
exports['typegen'] = typegen;
exports['gensecrets'] = gensecrets;
exports['logs'] = logs;
exports['deploy'] = deploy;
exports['rollback'] = rollback;
exports['db'] = db;
exports['redis'] = redis;
exports['migrator'] = series(buildapp, migrator);

exports['tscapi'] = tscapi;
exports['tscweb'] = tscweb;

exports['install'] = parallel(installapi, installweb, installaws);
exports['installapi'] = installapi;
exports['installweb'] = installweb;
exports['installaws'] = installaws;

exports['buildapp'] = buildapp;
exports['buildnginx'] = series(installweb, buildnginx);

exports['testall'] = series(gensecrets, buildapp, testapi, testweb);
exports['testapi'] = series(gensecrets, buildapp, testapi);
exports['testweb'] = series(gensecrets, buildapp, testweb);
exports['extractreports'] = extractReports;

exports['cdkdeploy'] = cdkdeploy;

exports['admin'] = admin;
exports['admindb'] = admindb;
exports['adminmigrate'] = adminmigrate;
