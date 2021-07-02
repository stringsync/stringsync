import { cmd } from './util';

export async function up(composeFile: string) {
  await cmd('docker', ['compose', '-f', composeFile, 'up', '--detach'], { reject: false });
}

export async function logs(composeFile: string) {
  await cmd('docker', ['compose', '-f', composeFile, 'logs', '-f'], { reject: false });
}

export async function down() {
  await cmd('docker', ['compose', 'down', '-v', '--remove-orphans']);
}

export async function build(dockerFile: string, tag: string) {
  await cmd('docker', ['build', '-f', dockerFile, '-t', tag, '.']);
}
