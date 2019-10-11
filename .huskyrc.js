// @ts-check

module.exports = {
  hooks: {
    'pre-commit':
      'tsc --noEmit --project server/tsconfig.json &&' +
      'tsc --noEmit --project web/tsconfig.json &&' +
      'yarn run lint --max-warnings 1',
  },
};
