const NodeEnvironment = require('jest-environment-node');
const { createNamespace } = require('cls-hooked');

const namespace = createNamespace('transaction');

class ServerTestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    this.context.process.stringSyncTransactionNamespace = namespace;
  }
}

module.exports = ServerTestEnvironment;
