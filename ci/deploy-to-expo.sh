#!/bin/bash -e

yarn global add expo-cli

fail=
for name in EXPO_USERNAME EXPO_PASSWORD CIRCLE_BRANCH SENTRY_AUTH_TOKEN ; do
  eval value=\$$name
  if [[ -z ${value} ]]; then
    echo >&2 "Missing required env variable: ${name}"
    fail=1
  fi
done

if [[ -n $fail ]]; then
  exit 1
fi

api_url="https://staging.api.theliturgists.com"
json -I -f config.json \
  -e "this.apiBaseUrl='${api_url}'" \
  -e "this.notificationScope='staging'"

expo login -u "${EXPO_USERNAME}" -p "${EXPO_PASSWORD}"

prefix=
if [[ "$1" == "storybook" ]]; then
  prefix="storybook-"
fi
channel=$(echo ${CIRCLE_BRANCH} | sed -E 's/[^A-Za-z0-9_-]+/-/g')
if [[ "${channel}" == "master" ]]; then
  channel="default"
fi

# Give node more heap space to avoid metro crashing
# during the publish bundling step
# https://forums.expo.io/t/cant-expo-publish-socket-hang-up/18080/2
node --max-old-space-size=8192 $(which expo) publish \
  --max-workers 1 --non-interactive --release-channel "${prefix}${channel}"
