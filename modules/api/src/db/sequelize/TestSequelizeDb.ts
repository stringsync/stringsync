import { injectable } from 'inversify';
import { Sequelize } from 'sequelize';
import { Db, Task } from './../types';
import { initModels } from './initModels';

@injectable()
export class TestSequelizeDb implements Db {
  private static hackClsNamespace() {
    // process.namespaces gets overwritten when importing cls-hooked:
    // https://github.com/Jeff-Lewis/cls-hooked/blob/master/context.js#L453
    // As a workaround, process.STRINGSYNC_namespace gets set by
    // ApiTestEnvironment.js, and then re-set here.
    const p = process as any;
    const namespace = p.STRINGSYNC_namespace;
    p.namespaces.transaction = namespace;
  }

  private static reuseDbConnectionFromProcess(): Sequelize {
    const p = process as any;
    return p.STRINGSYNC_sequelize;
  }

  sequelize: Sequelize;

  constructor() {
    TestSequelizeDb.hackClsNamespace();
    const sequelize = TestSequelizeDb.reuseDbConnectionFromProcess();
    initModels(sequelize);
    this.sequelize = sequelize;
  }

  async transaction(task: Task) {
    await this.sequelize.transaction(task);
  }

  async teardown() {
    // noop, the TestEnvironment takes care of teardown
  }
}
