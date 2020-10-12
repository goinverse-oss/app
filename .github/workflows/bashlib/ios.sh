# Bash commands for cached-dependencies action
# when building the iOS app.

default-setup-command() {
  yarn-install

  cd ${GITHUB_WORKSPACE}/ios

  cache-restore rubygems
  echo "::group::Install Ruby Gems"
  gem install xcpretty bundler --no-document
  bundle config path vendor/bundle
  bundle install
  echo "::endgroup"
  cache-save rubygems

  cache-restore cocoapods
  echo "::group::Install iOS CocoaPods"
  bundle exec pod install
  echo "::endgroup"
  cache-save cocoapods
}
