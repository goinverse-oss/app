#!/bin/bash

get_fakeapi_name() {
  # Set this temporarily to use a review app of theliturgists/fakeapi
  local suffix=""
  echo "theliturgists-fakeapi${suffix}"
}

get_fakeapi_url() {
  echo "https://$(get_fakeapi_name).herokuapp.com"
}

yarn global add exp

fail=
for name in EXPO_USERNAME EXPO_PASSWORD CIRCLE_BRANCH ; do
  eval value=\$$name
  if [[ -z ${value} ]]; then
    echo >&2 "Missing required env variable: ${name}"
    fail=1
  fi
done

if [[ -n $fail ]]; then
  exit 1
fi

api_url="$(get_fakeapi_url)"
json -I -f config.json -e "this.apiBaseUrl='${api_url}'"

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
