import { cleanup } from './scripts/cleanup';
import * as constants from './scripts/constants';
import * as docker from './scripts/docker';
import { Env } from './scripts/Env';
import * as graphqlCodegen from './scripts/graphqlCodegen';
import { log } from './scripts/util';

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
  const GRAPHQL_HOSTNAME = Env.string('GRAPHQL_HOSTNAME').get('localhost');
  const GRAPHQL_PORT = Env.number('GRAPHQL_PORT').get(80);
  const MAX_WAIT_MS = Env.number('MAX_WAIT_MS').get(1200000); // 2 minutes

  if (MAX_WAIT_MS <= 0) {
    throw new TypeError('MAX_WAIT_MS must be greater than 0');
  }

  await graphqlCodegen.typegen(GRAPHQL_HOSTNAME, GRAPHQL_PORT, MAX_WAIT_MS);
}

async function gensecrets() {
  log('gensecrets');
}

async function db() {
  log('db');
}

async function logs() {
  log('logs');
}

async function deploy() {
  log('deploy');
}

async function tscapi() {
  log('tscapi');
}

async function tscweb() {
  log('tscweb');
}

async function installapi() {
  log('installapi');
}

async function installweb() {
  log('installweb');
}

async function builddocker() {
  log('builddocker');
}

async function buildweb() {
  log('buildweb');
}

async function testall() {
  log('testall');
}

async function testapi() {
  log('testapi');
}

async function testweb() {
  log('testweb');
}

async function cfsync() {
  log('cfsync');
}

async function cfvalidate() {
  log('cfvalidate');
}

async function cfprune() {
  log('cfprune');
}

exports['dev'] = dev;
exports['fakeprod'] = fakeprod;
exports['down'] = down;
exports['typegen'] = typegen;
exports['gensecrets'] = gensecrets;
exports['db'] = db;
exports['logs'] = logs;
exports['deploy'] = deploy;

exports['tscapi'] = tscapi;
exports['tscweb'] = tscweb;

exports['installapi'] = installapi;
exports['installweb'] = installweb;

exports['builddocker'] = builddocker;
exports['buildweb'] = buildweb;

exports['testall'] = testall;
exports['testapi'] = testapi;
exports['testweb'] = testweb;

exports['cfsync'] = cfsync;
exports['cfvalidate'] = cfvalidate;
exports['cfprune'] = cfprune;
