# Bash commands for cached-dependencies action
# when building the Android app.

source $(dirname ${BASH_SOURCE[0]})/_gems.sh

default-setup-command() {
  yarn-install

  cd ${GITHUB_WORKSPACE}/android

  install_gems
}
