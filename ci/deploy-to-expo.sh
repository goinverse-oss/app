#!/bin/bash

get_now_alias() {
  echo "theliturgists-fakeapi-branch-${CIRCLE_BRANCH}" \
    | sed 's/[\/_.]/-/g' \
    | cut -c'-63'
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

api_url="https://$(get_now_alias).now.sh"
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
