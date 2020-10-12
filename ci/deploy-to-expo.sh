#!/bin/bash -e

function get_release_channel() {
  # Note: `expo publish` below will _set_ the release channel
  # in the ios/android files where it needs to be set.
  # Therefore, this function is now the definitive source
  # for what the release channel should be.

  local version=$(json <package.json .version)
  local prefix="production"
  if [[ "${version}" == *"beta"* ]]; then
    prefix="beta"
  fi

  # Pull out major version number
  # In our setup, breaking changes are JS changes that require
  # a new app store release; e.g. new native library added.
  # Thus, the release channel includes the major version
  # but no other version numbrers. Minor or patch semver bumps
  # can use the existing release channel and do not require
  # a new app store release.
  local major=${version%.*.*}

  local channel="${prefix}-${major}"
  echo ${channel}
}

fail=
for name in EXPO_USERNAME EXPO_PASSWORD GITHUB_REF SENTRY_AUTH_TOKEN ; do
  eval value=\$$name
  if [[ -z ${value} ]]; then
    echo >&2 "Missing required env variable: ${name}"
    fail=1
  fi
done

if [[ -n $fail ]]; then
  exit 1
fi

BRANCH=${GITHUB_REF#refs/heads/}
publishable_branches=("master" "deploy-beta" "deploy-production")
if [[ ! " ${publishable_branches[@]} " =~ " ${BRANCH} " ]]; then
  # should already be checked in the workflow config, but
  # let's just make sure here as well
  echo >&2 "Currently on non-publishable branch ${BRANCH}; bailing out"
  exit 1
fi

bump=$(conventional-recommended-bump)
if [[ "${bump}" == "major" ]]; then
  echo >&2 "Error: breaking changes not yet published in a major version"
  echo >&2 "Run 'yarn release', push the branch, and try again"
  exit 1
fi

stage="production"
api_url="https://${stage}.api.theliturgists.com"
json -I -f config.json \
  -e "this.apiBaseUrl='${api_url}'" \
  -e "this.notificationScope='${stage}'"

expo login -u "${EXPO_USERNAME}" -p "${EXPO_PASSWORD}"

channel=$(get_release_channel)

# Give node more heap space to avoid metro crashing
# during the publish bundling step
# https://forums.expo.io/t/cant-expo-publish-socket-hang-up/18080/2
node --max-old-space-size=8192 $(which expo) publish \
  --max-workers 1 --non-interactive --release-channel "${channel}"
