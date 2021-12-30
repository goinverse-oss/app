install_gems() {
  cache-restore rubygems
  echo "::group::Install Ruby Gems"
  gem install xcpretty bundler --no-document
  bundle config path vendor/bundle
  bundle install
  echo "::endgroup"
  cache-save rubygems
}
