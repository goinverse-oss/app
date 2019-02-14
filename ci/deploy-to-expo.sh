#!/bin/bash -e

yarn global add exp

fail=
for name in EXPO_USERNAME EXPO_PASSWORD CIRCLE_BRANCH PATREON_CLIENT_ID CONTENTFUL_SANDBOX_SPACE CONTENTFUL_SANDBOX_ENVIRONMENT CONTENTFUL_SANDBOX_ACCESS_TOKEN ; do
  eval value=\$$name
  if [[ -z ${value} ]]; then
    echo >&2 "Missing required env variable: ${name}"
    fail=1
  fi
done

if [[ -n $fail ]]; then
  exit 1
fi

# XXX: clever folk will be able to retrieve this access token and gain
# read-only access to anything in the space. That's fine; we won't put anything
# sensitive there. Once we go live with our real API, we will revoke this token
# and use a different one that only the API backend knows about.
api_url="https://staging.api.theliturgists.com"
json -I -f config.json \
  -e "this.apiBaseUrl='${api_url}'" \
  -e "this.patreonClientId=${PATREON_CLIENT_ID}" \
  -e "this.contentful={
    space: '${CONTENTFUL_SANDBOX_SPACE}',
    environment: '${CONTENTFUL_SANDBOX_ENVIRONMENT}',
    accessToken: '${CONTENTFUL_SANDBOX_ACCESS_TOKEN}'
  }"

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
