module.exports = {
  apps: [
    {
      name: 'api',
      script: './packages/api/dist/index.js',
      instances: 1,
      kill_timeout: 30000,
    },
    {
      name: 'jobs',
      script: './packages/jobs/dist/index.js',
      instances: 1,
      kill_timeout: 30000,
    },
  ],
};
