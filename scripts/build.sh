#!/bin/bash -e

# Run a release build with fastlane.

usage() {
  echo >&2 "Usage: $0 <ios|android>"
  exit 1
}

platform=$1
action=$2

case ${platform} in
  ios) ;;
  android) ;;
  *) usage ;;
esac

case ${action} in
  beta) ;;
  build) ;;
  *) usage ;;
esac

cd ${platform}
bundle exec fastlane ${action}
