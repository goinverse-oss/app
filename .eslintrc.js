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
    // Apparently react-native doesn't like .jsx files
    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-underscore-dangle': 'off',
    'function-paren-newline': ['error', 'consistent'],
    'prefer-destructuring': 'off',
  },
  // https://github.com/benmosher/eslint-plugin-import/issues/279#issuecomment-215052176
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.js',

          // react-native in general
          '.android.js',
          '.ios.js',

          // react-native-screens
          '.native.js',
          '.web.js',
        ],
      },
    },
  },
};
