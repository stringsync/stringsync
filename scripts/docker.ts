import * as path from 'path';
import { cmd } from './util';

export const DOCKER_DIR = path.join(__dirname, '..', 'docker');

export async function up(composeFile: string) {
  await cmd('docker-compose', ['-f', path.join(DOCKER_DIR, composeFile), 'up', '--detach'], { reject: false });
}

export async function logs(composeFile: string) {
  await cmd('docker-compose', ['-f', path.join(DOCKER_DIR, composeFile), 'logs', '-f'], { reject: false });
}

export async function down(composeFile: string) {
  await cmd('docker-compose', ['-f', path.join(DOCKER_DIR, composeFile), 'down', '-v', '--remove-orphans']);
}

export async function build(dockerfile: string, tag: string, buildArgs: Record<string, string> = {}) {
  const buildArgsFlags = [];
  for (const [key, val] of Object.entries(buildArgs)) {
    buildArgsFlags.push('--build-arg');
    buildArgsFlags.push(`${key}=${val}`);
  }
  await cmd('docker', [
    'build',
    '-f',
    path.join(DOCKER_DIR, dockerfile),
    '--cache-from',
    tag,
    '-t',
    tag,
    ...buildArgsFlags,
    '.',
  ]);
}

export async function db(composeFile: string, dbUsername: string) {
  await cmd('docker-compose', ['-f', path.join(DOCKER_DIR, composeFile), 'exec', 'db', 'psql', '-U', dbUsername]);
}

export async function redis(composeFile: string) {
  await cmd('docker-compose', ['-f', path.join(DOCKER_DIR, composeFile), 'exec', 'redis', 'redis-cli']);
}

export async function migrator(composeFile: string) {
  await cmd('docker-compose', ['-f', path.join(DOCKER_DIR, composeFile), 'run', 'api', 'bash']);
}
