import { cmd } from './util';

export async function up(composeFile: string) {
  await cmd('docker-compose', ['-f', composeFile, 'up', '--detach'], { reject: false });
}

export async function logs(composeFile: string) {
  await cmd('docker-compose', ['-f', composeFile, 'logs', '-f'], { reject: false });
}

export async function down(composeFile: string) {
  await cmd('docker-compose', ['-f', composeFile, 'down', '-v', '--remove-orphans']);
}

export async function build(dockerfile: string, tag: string) {
  await cmd('docker', ['build', '-f', dockerfile, '--cache-from', tag, '-t', tag, '.']);
}

export async function db(composeFile: string, dbUsername: string) {
  await cmd('docker-compose', ['-f', composeFile, 'exec', 'db', 'psql', '-U', dbUsername]);
}
