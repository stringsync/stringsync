// @ts-check

module.exports = {
  hooks: {
    'pre-commit':
      'tsc --noEmit --project server/tsconfig.json &&' +
      'tsc --noEmit --project web/tsconfig.json &&' +
      'ss lint -s &&' +
      'ss prettier -s -f',
  },
};
