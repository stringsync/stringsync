module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  resetModules: true,
  roots: ['<rootDir>/modules'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
