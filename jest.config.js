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
  roots: ['<rootDir>/modules'],
};
