import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { ROOT_PATH } from '../util/constants';
import { cmd } from '../util';

const ALL_CMDS = [
  'db:migrate',
  'db:migrate:schema:timestamps:add',
  'db:migrate:status',
  'db:migrate:undo',
  'db:migrate:undo:all',
  'db:seed',
  'db:seed:undo',
  'db:seed:all',
  'db:seed:undo:all',
  'db:create',
  'db:drop',
  'init',
  'init:config',
  'init:migrations',
  'init:models',
  'init:seeders',
  'migration:generate',
  'model:generate',
  'seed:generate',
];
const BLACKLISTED_CMDS = [
  'db:migration:schema:timestamps:add',
  'init',
  'init:config',
  'init:migrations',
  'init:models',
  'init:seeders',
  'model:generate',
];
const WHITELISTED_CMDS = (() => {
  const blacklist = new Set(BLACKLISTED_CMDS);
  return ALL_CMDS.filter((cmd) => !blacklist.has(cmd));
})();
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
    const { argv, flags, args } = this.parse(Sql);
    const command = args.cmd;

    // ensure cmd is allowed
    if (!WHITELISTED_CMDS.includes(command) || command === 'help') {
      const buffer = execSync('./bin/ss exec -T server yarn sequelize help', {
        stdio: 'pipe',
      });

      const msg = buffer
        .toString()
        .split('\n')
        // very slow but simple algorithm
        // don't expect the blacklist to grow
        // could use trie if needed
        .filter((line) => !BLACKLISTED_CMDS.some((cmd) => line.includes(cmd)))
        .join('\n');
      this.log(msg);
      this.exit(command === 'help' ? 0 : 1);
    }

    // intercept generate: command and run custom generator
    // the script will exit after running custom generator
    if (command.startsWith('generate:')) {
      if (!flags.name) {
        this.log('--name flag required');
        this.exit(1);
      }
      this.log(`running custom ${command} command on host`);
      this.log('copying migration.template.ts');
      const src = TEMPLATE;
      const dst = path.resolve(
        getGenerateDirPath(command),
        getGeneratedFilename(`-${flags.name}.ts`)
      );
      fs.copyFileSync(src, dst);
      this.log(`created ${dst}`);
      return this.exit();
    }

    // run the actual command against the sequelize library
    execSync(
      cmd('./bin/ss', 'exec', 'scripts', 'yarn', 'sequelize', argv.join(' ')),
      {
        stdio: 'inherit',
        cwd: ROOT_PATH,
      }
    );
  }
}
