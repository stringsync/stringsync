import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const BLACKLISTED_CMDS = ['model:generate'];
const GENERATE_MIGRATION_CMD = 'migration:generate';
const GENERATE_SEED_CMD = 'seed:generate';
const SERVER_ROOT_PATH = path.resolve('..', 'server');
const SERVER_SRC_DB_PATH = path.resolve(SERVER_ROOT_PATH, 'src', 'db');
const SERVER_MIGRATION_PATH = path.resolve(SERVER_SRC_DB_PATH, 'migrations');
const SERVER_SEEDERS_PATH = path.resolve(SERVER_SRC_DB_PATH, 'seeders');
const TEMPLATE = path.resolve(
  __dirname,
  '../templates',
  'migration.template.ts'
);

const hasBlacklistedCmd = (argv: string[]) => {
  return argv.some((arg) => BLACKLISTED_CMDS.includes(arg));
};

const hasDbCmd = (argv: string[]) => {
  return argv.length > 0 && argv[0].startsWith('db:');
};

const getGenerateDirPath = (cmd: string) => {
  switch (cmd) {
    case GENERATE_MIGRATION_CMD:
      return SERVER_MIGRATION_PATH;
    case GENERATE_SEED_CMD:
      return SERVER_SEEDERS_PATH;
    default:
      throw new TypeError(`no generate directory for cmd: ${cmd}`);
  }
};

const getGeneratedFilename = (suffix: string) => {
  const now = new Date();
  const prefix = [
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
  ]
    .map((part) => part.toString().padStart(2, '0'))
    .join('');
  return prefix + suffix;
};

export default class Sql extends Command {
  static description = 'Runs sequelize commands on a running server service.';

  static strict = false;

  static flags = {
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n' }),
  };

  static args = [{ name: 'cmd', required: true }];

  async run() {
    const { argv, flags } = this.parse(Sql);

    if (hasBlacklistedCmd(argv)) {
      this.log(
        `the following commands are not allowed: ${BLACKLISTED_CMDS.join(',')}`
      );
      this.exit();
    }

    const generateCmd =
      argv.find((arg) => arg === GENERATE_MIGRATION_CMD) ||
      argv.find((arg) => arg === GENERATE_SEED_CMD);

    if (generateCmd) {
      if (!flags.name) {
        this.log('--name flag required');
        this.exit(1);
      }
      this.log(`running custom ${generateCmd} command`);
      this.log('copying migration.template.ts');
      const src = TEMPLATE;
      const dst = path.resolve(
        getGenerateDirPath(generateCmd),
        getGeneratedFilename(`-${flags.name}.ts`)
      );
      fs.copyFileSync(src, dst);
      this.log(`created ${dst}`);
      return this.exit();
    }

    if (hasDbCmd(argv)) {
      this.log(`compiling .ts files with tsc`);
      execSync(`ss exec server yarn tsc --project tsconfig.db.json`, {
        stdio: 'inherit',
      });
    }

    execSync(`ss exec server yarn sequelize ${argv.join(' ')}`, {
      stdio: 'inherit',
    });
  }
}
