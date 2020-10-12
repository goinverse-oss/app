// Default cache settings for cached-dependencies action.

const { execSync } = require('child_process');

const { HOME = '~' } = process.env;
const yarnCacheDir = execSync("yarn cache dir", { encoding: 'utf8' }).trim();

module.exports = {
  yarn: {
    path: [yarnCacheDir],
    hashFiles: [
      'yarn.lock',
      '!node_modules/*/yarn.lock',
    ],
  },
};
