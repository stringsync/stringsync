import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import { ROOT_PATH } from '../util';
import fetch from 'node-fetch';

export default class Typegen extends Command {
  static GRAPHQL_SERVER_URI = 'http://localhost:3000/graphql';

  static MAX_WAIT_MS = 1200000; // 2 minutes

  static description = 'Runs the graphql code generator ';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Typegen);

    const wasGraphqlUp = await this.isGraphqlUp();

    if (!wasGraphqlUp) {
      this.log('temporarily bringing up main project');
      execSync('./bin/ss up', { cwd: ROOT_PATH, stdio: 'inherit' });
      await this.waitForGraphql();
    }

    execSync('yarn web typegen', { cwd: ROOT_PATH, stdio: 'inherit' });

    if (!wasGraphqlUp) {
      this.log('bringing down main project');
      execSync('./bin/ss down', { cwd: ROOT_PATH, stdio: 'inherit' });
    }
  }

  async isGraphqlUp(): Promise<boolean> {
    try {
      await fetch(Typegen.GRAPHQL_SERVER_URI);
    } catch (e) {
      return false;
    }
    return true;
  }

  async waitForGraphql(): Promise<void> {
    const start = new Date();

    const getElapsedTimeMs = () => {
      const now = new Date();
      return now.getTime() - start.getTime();
    };

    const wait = (ms: number) =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      });

    process.stdout.write('waiting for graphql.');

    while (getElapsedTimeMs() < Typegen.MAX_WAIT_MS) {
      process.stdout.write('.');

      const isGraphqlUp = await this.isGraphqlUp();
      if (isGraphqlUp) {
        return;
      }

      await wait(1000);
    }

    throw new Error('graphql never came up');
  }
}
