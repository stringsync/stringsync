const NodeEnvironment = require('jest-environment-node');
const { getWorkerDbName } = require('./workers');

class TestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    const workerId = process.env.JEST_WORKER_ID || '0';
    const workerDbName = getWorkerDbName(workerId);

    const ctx = this.getVmContext();
    if (ctx) {
      ctx.process.env.DB_NAME = workerDbName;
    }
  }
}

module.exports = TestEnvironment;
