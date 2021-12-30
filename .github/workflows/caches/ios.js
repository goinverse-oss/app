// Common cache settings for cached-dependencies action
// when building the iOS app.

const defaults = require('../caches');

module.exports = {
  ...defaults,

  rubygems: {
    path: ['ios/vendor/bundle'],
    hashFiles: ['ios/Gemfile.lock'],
  },
  cocoapods: {
    path: ['ios/Pods'],
    hashFiles: ['ios/Podfile.lock'],
  },
};
