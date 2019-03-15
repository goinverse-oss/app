#!/bin/bash -e

yarn global add exp

fail=
for name in EXPO_USERNAME EXPO_PASSWORD CIRCLE_BRANCH SENTRY_AUTH_TOKEN SENTRY_DSN ; do
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
  -e "this.sentryPublicDSN='${SENTRY_DSN}'"

exp login -u "${EXPO_USERNAME}" -p "${EXPO_PASSWORD}"

prefix=
if [[ "$1" == "storybook" ]]; then
  prefix="storybook-"
fi
channel=${CIRCLE_BRANCH}
if [[ "${channel}" == "master" ]]; then
  channel="default"
fi
exp publish --release-channel "${prefix}${channel}"
