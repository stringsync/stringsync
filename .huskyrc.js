// @ts-check

module.exports = {
  hooks: {
    'pre-commit':
      'tsc --noEmit --project server/tsconfig.json &&' +
      'tsc --noEmit --project web/tsconfig.json &&' +
      'yarn eslint --quiet --max-warnings 1 --ext ts,tsx  ./common ./server/src ./web/src',
  },
};
