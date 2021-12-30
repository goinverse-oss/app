// Common cache settings for cached-dependencies action
// when building the Android app.

const defaults = require('../caches');

module.exports = {
  ...defaults,

  rubygems: {
    path: ['android/vendor/bundle'],
    hashFiles: ['android/Gemfile.lock'],
  },
};
