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
  testPathIgnorePatterns: ['node_modules'],
  testEnvironment: '<rootDir>/ApiTestEnvironment.js',
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
