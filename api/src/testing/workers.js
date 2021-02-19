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

module.exports = { getWorkerDbName, getWorkerDbNames };
