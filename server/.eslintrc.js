module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier:@typescript-eslint',
  ],
  rules: {},
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
};
