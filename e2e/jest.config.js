module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  roots: ['<rootDir>/web/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '^common/(.*)': '<rootDir>/../common/$1',
  },
};
