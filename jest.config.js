module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  reporters: ['default', 'jest-junit'],
  resetModules: false,
  testPathIgnorePatterns: ['node_modules', 'web', 'build', 'dist'],
  testEnvironment: '<rootDir>/ServerTestEnvironment.js',
  roots: ['<rootDir>/packages'],
  setupFilesAfterEnv: ['jest-extended', '<rootDir>/packages/api/src/testing/jest.setup.ts'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
