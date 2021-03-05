module.exports = {
  apps: [
    {
      name: 'api',
      exec_mode: 'cluster',
      script: './build/entrypoints/api.js',
      instances: 'max',
      kill_timeout: 10000,
    },
    {
      name: 'worker',
      exec_mode: 'cluster',
      script: './build/entrypoints/worker.js',
      instances: 'max',
      kill_timeout: 10000,
    },
  ],
};
