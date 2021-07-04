import path from 'path';
import { cleanup } from './scripts/cleanup';
import * as constants from './scripts/constants';
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
const WATCH = Env.boolean('WATCH');

async function dev() {
  const composeFile = constants.DOCKER_COMPOSE_DEV_FILE;

  cleanup(docker.down);
  await docker.up(composeFile);
  await docker.logs(composeFile);
}

async function fakeprod() {
  const composeFile = constants.DOCKER_COMPOSE_FAKE_PROD_FILE;

  cleanup(docker.down);
  await docker.up(composeFile);
  await docker.logs(composeFile);
}

async function down() {
  await docker.down();
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

  log('bumping api version');
  await cmd('yarn', [], { cwd: Project.API });

  log('bumping web version');
  await cmd('yarn', [], { cwd: Project.WEB });

  log('committing version changes');
  await cmd('git', ['add', 'api/package.json', 'web/package.json']);
  await cmd('git', ['commit', '-m', 'Bump app versions.']);

  log('pushing to aws remote');
  await cmd('git', ['push', 'origin']);
  await cmd('git', ['push', remote, `${branch}:master`]);
}

async function db() {
  const composeFile = DOCKER_COMPOSE_FILE.getOrDefault(constants.DOCKER_COMPOSE_DEV_FILE);
  const dbUsername = DB_USERNAME.getOrDefault('stringsync');

  await docker.db(composeFile, dbUsername);
}

async function cdk() {
  await cmd('yarn', ['cdk'], { reject: false, cwd: Project.AWS });
}

async function tscapi() {
  const watch = WATCH.getOrDefault(true);

  await cmd('tsc', ['--noEmit', watch ? '--watch' : ''].filter(identity), { cwd: Project.API });
}

async function tscweb() {
  const watch = WATCH.getOrDefault(true);

  await cmd('tsc', ['--noEmit', watch ? '--watch' : ''].filter(identity), { cwd: Project.WEB });
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

async function builddocker() {
  const dockerTag = DOCKER_TAG.getOrDefault('stringsync:latest');
  const dockerfile = DOCKERFILE.getOrDefault('Dockerfile');

  await docker.build(dockerfile, dockerTag);
}

async function buildweb() {
  await cmd('yarn', ['build'], { cwd: Project.WEB });
}

async function testall() {
  const ci = CI.getOrDefault(false);

  if (!ci) {
    return;
  }

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

exports['dev'] = dev;
exports['fakeprod'] = fakeprod;
exports['down'] = down;
exports['typegen'] = typegen;
exports['gensecrets'] = gensecrets;
exports['logs'] = logs;
exports['deploy'] = deploy;
exports['db'] = db;
exports['cdk'] = cdk;

exports['tscapi'] = tscapi;
exports['tscweb'] = tscweb;

exports['install'] = parallel(installapi, installweb, installaws);
exports['installapi'] = installapi;
exports['installweb'] = installweb;
exports['installaws'] = installaws;

exports['builddocker'] = builddocker;
exports['buildweb'] = buildweb;

exports['testall'] = series(testall, testapi, testweb);
exports['testapi'] = testapi;
exports['testweb'] = testweb;
