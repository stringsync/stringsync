module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  roots: ['<rootDir>/src/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globalSetup: './setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './PuppeteerEnvironment.js',
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '^common/(.*)': '<rootDir>/../common/$1',
  },
};
