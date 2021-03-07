const getWorkerDbName = (workerId) => {
  return `test_${workerId}`;
};

const getWorkerDbNames = (numWorkers) => {
  const workerDbNames = [];
  for (let workerId = 1; workerId <= numWorkers; workerId++) {
    const workerDbName = getWorkerDbName(workerId);
    workerDbNames.push(workerDbName);
  }
  return workerDbNames;
};

const getWorkerRedisHost = (workerId) => {
  if (1 > workerId || workerId > 3) {
    throw new Error(`can't support workerId '${workerId}', add more redis nodes to docker-compose.test.yml first`);
  }
  return `redis${workerId}`;
};

module.exports = { getWorkerDbName, getWorkerDbNames, getWorkerRedisHost };
