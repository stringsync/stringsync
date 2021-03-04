module.exports = {
  apps: [
    {
      name: 'api',
      watch: true,
      script: './build/entrypoints/api.js',
      instances: 1,
      kill_timeout: 10000,
      max_memory_restart: '1G',
    },
    {
      name: 'worker',
      watch: true,
      script: './build/entrypoints/worker.js',
      instances: 1,
      kill_timeout: 10000,
      max_memory_restart: '1G',
    },
  ],
};
