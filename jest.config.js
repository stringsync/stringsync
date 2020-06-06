module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  resetModules: true,
  roots: ['<rootDir>/modules'],
  setupFilesAfterEnv: ['<rootDir>/modules/container/src/resetContainerAfterTestSuite.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
