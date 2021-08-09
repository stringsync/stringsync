module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      // Make test suites faster https://github.com/kulshekhar/ts-jest/issues/259
      // In the CI pipeline, typechecking is implicitly done when building the container
      // so we don't need this option ever.
      isolatedModules: true,
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globalSetup: '<rootDir>/src/testing/globalSetup.js',
  globalTeardown: '<rootDir>/src/testing/globalTeardown.js',
  reporters: ['default', 'jest-junit'],
  resetModules: false,
  testPathIgnorePatterns: ['node_modules'],
  testEnvironment: '<rootDir>/src/testing/TestEnvironment.js',
  testRunner: 'jest-circus/runner',
  setupFilesAfterEnv: ['jest-extended', '<rootDir>/src/testing/jest.setup.ts'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
