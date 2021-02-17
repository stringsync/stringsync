module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  reporters: ['default', 'jest-junit'],
  resetModules: false,
  testPathIgnorePatterns: ['node_modules'],
  testEnvironment: '<rootDir>/ApiTestEnvironment.js',
  setupFilesAfterEnv: ['jest-extended', '<rootDir>/src/testing/jest.setup.ts'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
