// @ts-check

module.exports = {
  hooks: {
    'pre-commit': 'yarn run lint --max-warnings 1',
  },
};
