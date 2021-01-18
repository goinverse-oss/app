#!/bin/bash -e

source $(dirname $0)/common.inc

validate_required_env_vars EXPO_USERNAME EXPO_PASSWORD GITHUB_REF SENTRY_AUTH_TOKEN

stage="production"
api_url="https://${stage}.api.theliturgists.com"
json -I -f config.json \
  -e "this.apiBaseUrl='${api_url}'" \
  -e "this.notificationScope='${stage}'"

expo login -u "${EXPO_USERNAME}" -p "${EXPO_PASSWORD}"

channel=$(get_release_channel ${GITHUB_REF})

# Give node more heap space to avoid metro crashing
# during the publish bundling step
# https://forums.expo.io/t/cant-expo-publish-socket-hang-up/18080/2
node --max-old-space-size=8192 $(which expo) publish \
  --max-workers 1 --non-interactive --target bare \
  --release-channel "${channel}"
