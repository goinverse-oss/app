# Bash commands for cached-dependencies action
# when building the iOS app.

source $(dirname ${BASH_SOURCE[0]})/_gems.sh

default-setup-command() {
  npm-install

  (
    cd ${GITHUB_WORKSPACE}/ios
    install_gems
  )

  (
    cd ${GITHUB_WORKSPACE}/ios
    cache-restore cocoapods
    echo "::group::Install iOS CocoaPods"
    bundle exec pod install
    echo "::endgroup"
    cache-save cocoapods
  )
}
