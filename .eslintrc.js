const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  extends: ['plugin:@typescript-eslint/recommended', 'react-app'],
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/no-commonjs': OFF,
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/no-unused-vars': OFF,
    '@typescript-eslint/camelcase': OFF,
    '@typescript-eslint/no-var-requires': OFF,
    '@typescript-eslint/prefer-namespace-keyword': OFF,
    '@typescript-eslint/no-non-null-assertion': OFF,
    '@typescript-eslint/no-empty-interface': OFF,
    '@typescript-eslint/explicit-member-accessibility': [ERROR, { accessibility: 'no-public' }],
    '@typescript-eslint/member-ordering': [
      ERROR,
      {
        default: [
          'public-static-field',
          'protected-static-field',
          'private-static-field',
          'public-static-method',
          'protected-static-method',
          'private-static-method',
          'public-instance-field',
          'protected-instance-field',
          'private-instance-field',
          'constructor',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method',
        ],
      },
    ],
  },
};
