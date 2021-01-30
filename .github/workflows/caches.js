// Default cache settings for cached-dependencies action.

const { execSync } = require('child_process');

module.exports = {
  npm: {
    path: ['~/.npm'],
    hashFiles: [
      'package-lock.json',
      '!node_modules/*/package-lock.json',
    ],
  },
};
