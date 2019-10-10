const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'server/tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  env: {
    es6: true,
    node: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/no-unused-vars': WARN,
    '@typescript-eslint/explicit-function-return-type': ERROR,
  },
};
