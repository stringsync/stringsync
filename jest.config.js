module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  resetModules: false,
  testPathIgnorePatterns: ['node_modules', 'web'],
  testEnvironment: '<rootDir>/ServerTestEnvironment.js',
  roots: ['<rootDir>/packages'],
  setupFilesAfterEnv: ['jest-extended', '<rootDir>/packages/graphql/src/testing/jest.setup.ts'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
