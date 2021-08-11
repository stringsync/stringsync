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

export async function build(dockerfile: string, tag: string, buildArgs: Record<string, string> = {}) {
  const buildArgsFlags = [];
  for (const [key, val] of Object.entries(buildArgs)) {
    buildArgsFlags.push('--build-arg');
    buildArgsFlags.push(`${key}=${val}`);
  }
  await cmd('docker', ['build', '-f', dockerfile, '--cache-from', tag, '-t', tag, ...buildArgsFlags, '.']);
}

export async function db(composeFile: string, dbUsername: string) {
  await cmd('docker-compose', ['-f', composeFile, 'exec', 'db', 'psql', '-U', dbUsername]);
}

export async function redis(composeFile: string) {
  await cmd('docker-compose', ['-f', composeFile, 'exec', 'redis', 'redis-cli']);
}

export async function migrator(composeFile: string) {
  await cmd('docker-compose', ['-f', composeFile, 'run', 'api', 'bash']);
}
