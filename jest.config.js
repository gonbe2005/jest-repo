// jest.config.js
export default {
  testEnvironment: 'jest-environment-node',  
  moduleFileExtensions: ['js', 'mjs'],
  testMatch: ['**/?(*.)+(spec|test).mjs'],
  transform: {
    '^.+\\.mjs$': 'babel-jest'
  },
  collectCoverage: true  // カバレッジ収集を有効にする
};
