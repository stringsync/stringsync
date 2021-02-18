module.exports = {
  apps: [
    {
      name: 'api',
      watch: true,
      script: './src/entrypoints/api.ts',
      instances: 1,
      kill_timeout: 10000,
    },
    {
      name: 'worker',
      watch: true,
      script: './src/entrypoints/worker.ts',
      instances: 1,
      kill_timeout: 10000,
    },
  ],
};
