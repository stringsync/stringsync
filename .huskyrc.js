// @ts-check

module.exports = {
  hooks: {
    'pre-commit':
      'yarn tsc --noEmit --project server/tsconfig.json &&' +
      'yarn tsc --noEmit --project web/tsconfig.json &&' +
      'ss lint -s &&' +
      'ss prettier -s -f',
  },
};
