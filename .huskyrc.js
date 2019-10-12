// @ts-check

module.exports = {
  hooks: {
    'pre-commit':
      'tsc --noEmit --project server/tsconfig.json &&' +
      'tsc --noEmit --project web/tsconfig.json &&' +
      'yarn run lint --quiet --max-warnings 1 &&' +
      'yarn prettier --write server/src/**/* &&' +
      'yarn prettier --write web/src/**/* &&' +
      'yarn prettier --write common/**/*',
  },
};
