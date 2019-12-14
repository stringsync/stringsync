module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/src/testing/setupTests.js'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
};
