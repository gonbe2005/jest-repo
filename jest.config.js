module.exports = {
  testEnvironment: 'jest-environment-node',  // 'node'から'jest-environment-node'に変更
  moduleFileExtensions: ['js', 'mjs'],
  testMatch: ['**/?(*.)+(spec|test).mjs'],
  transform: {
    '^.+\\.mjs$': 'babel-jest'  // .mjsファイルをBabelでトランスパイルするように設定
  }
};
