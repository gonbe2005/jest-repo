module.exports = {
    testEnvironment: 'node',
    transform: {},
    moduleNameMapper: {
      '^.+\\.mjs$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'mjs'],
    testMatch: ['**/?(*.)+(spec|test).mjs']
  };
  