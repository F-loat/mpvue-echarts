module.exports = {
  root: true,
  extends: 'airbnb-base',
  parser: 'babel-eslint',
  env: {
    'browser': false,
  },
  plugins: [
    'html',
  ],
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  rules: {
    'no-console': 0,
    'prefer-rest-params': 0,
    'class-methods-use-this': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': 0
  },
  globals: {
    wx: true,
  },
};
