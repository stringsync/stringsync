module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
    db: undefined,
  },
  roots: ['<rootDir>/src/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^common/(.*)': '<rootDir>/../common/$1',
  },
  setupFiles: ['<rootDir>/src/jest/setup.ts'],
};
