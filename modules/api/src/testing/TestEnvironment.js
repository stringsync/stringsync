const NodeEnvironment = require('jest-environment-node');
const { createNamespace } = require('cls-hooked');
const { Sequelize } = require('sequelize');
const { getWorkerDbName } = require('./workers');

const namespace = createNamespace('transaction');
Sequelize.useCLS(namespace);

class TestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    const logLevel = (process.env.LOG_LEVEL || '').toUpperCase();
    const workerId = process.env.JEST_WORKER_ID || '0';

    this.sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: getWorkerDbName(workerId),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      logging: logLevel === 'DEBUG' ? console.log : false,
    });

    const ctx = this.getVmContext();
    if (ctx) {
      ctx.process.env.DB_NAME = getWorkerDbName(workerId);
    }
  }

  async teardown() {
    await this.sequelize.close();
    await super.teardown();
  }

  async handleTestEvent(event, state) {
    switch (event.name) {
      case 'test_done':
        await this.onTestDone();
        break;
      default:
        break;
    }
  }

  async onTestDone() {
    // await this.sequelize.truncate({ logging: console.log });
  }
}

module.exports = TestEnvironment;
