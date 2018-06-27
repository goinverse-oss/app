module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true,
    },
  },
  env: {
    es6: true,
    jest: true,
  },
  extends: ['airbnb'],
  rules: {
    // Apprently react-native doesn't like .jsx files
    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-underscore-dangle': 'off',
  },
};
