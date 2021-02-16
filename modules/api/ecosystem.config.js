module.exports = {
  apps: [
    {
      name: 'api',
      watch: true,
      script: './src/api.ts',
      instances: 1,
      kill_timeout: 10000,
    },
    {
      name: 'worker',
      watch: true,
      script: './src/worker.ts',
      instances: 1,
      kill_timeout: 10000,
    },
  ],
};
