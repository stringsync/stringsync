import { DOCKER_COMPOSE_FAKE_PROD_FILE } from './constants';
import { cmd } from './util';

export async function up(composeFile: string) {
  await cmd('docker-compose', ['-f', composeFile, 'up', '--detach'], { reject: false });
}

export async function logs(composeFile: string) {
  await cmd('docker-compose', ['-f', composeFile, 'logs', '-f'], { reject: false });
}

export async function down() {
  await cmd('docker-compose', ['-f', DOCKER_COMPOSE_FAKE_PROD_FILE, 'down', '-v', '--remove-orphans']);
}

export async function build(dockerfile: string, tag: string) {
  await cmd('docker', ['build', '-f', dockerfile, '-t', tag, '.']);
}

export async function db(composeFile: string, dbUsername: string) {
  await cmd('docker-compose', ['-f', composeFile, 'exec', 'db', 'psql', '-U', dbUsername]);
}
