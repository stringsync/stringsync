module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  roots: ['<rootDir>/modules'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
