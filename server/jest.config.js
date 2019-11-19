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
  moduleNameMapper: {
    '^common/(.*)': '<rootDir>/../common/$1',
  },
  globalSetup: '<rootDir>/jest.setup.js',
};
