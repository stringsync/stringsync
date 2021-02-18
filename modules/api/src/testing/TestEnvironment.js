const NodeEnvironment = require('jest-environment-node');
const { createNamespace } = require('cls-hooked');
const { Sequelize } = require('sequelize');

const namespace = createNamespace('transaction');
Sequelize.useCLS(namespace);

class TestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    const logLevel = (process.env.LOG_LEVEL || '').toUpperCase();

    this.sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      logging: logLevel === 'DEBUG' ? console.log : undefined,
    });

    const ctx = this.getVmContext();
    if (ctx) {
      ctx.process.STRINGSYNC_sequelize = this.sequelize;
      ctx.process.STRINGSYNC_namespace = namespace;
    }
  }

  async teardown() {
    await this.sequelize.close();
    await super.teardown();
  }

  async handleTestEvent(event, state) {
    switch (event.name) {
      case 'test_start':
        await this.onTestStart();
        break;
      case 'test_done':
        await this.onTestDone();
        break;
      default:
        break;
    }
  }

  async onTestStart() {
    if (!this.transaction) {
      this.transaction = await this.sequelize.transaction();
    }
  }

  async onTestDone() {
    if (this.transaction) {
      await this.transaction.rollback();
      this.transaction = undefined;
    }
  }
}

module.exports = TestEnvironment;
