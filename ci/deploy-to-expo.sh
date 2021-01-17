#!/bin/bash -ex

is_tag() {
  local ref=$1
  [[ $ref == "refs/tags"* ]]
}

is_branch() {
  local ref=$1
  [[ $ref == "refs/heads"* ]]
}

ref_name() {
  local ref=$1
  if is_tag $ref ; then
    echo ${ref#refs/tags/}
  elif is_branch $ref ; then
    echo ${ref#refs/heads/}
  else
    echo >&2 "Got ref of unknown type: '${ref}'"
    exit 1
  fi
}

validate_ref() {
  ref_name $@ > /dev/null
}

function get_release_channel() {
  # Note: `expo publish` below will _set_ the release channel
  # in the ios/android files where it needs to be set.
  # Therefore, this function is now the definitive source
  # for what the release channel should be.

  local ref=$1
  validate_ref $ref  # just validate the ref here

  if is_branch ${ref} ; then
    local branch=$(ref_name $ref)
    if [[ "${branch}" == "master" || "${branch}" == "beta" ]]; then
      bump=$(conventional-recommended-bump)
      if [[ "${bump}" == "major" ]]; then
        echo >&2 "Error: breaking changes not yet published in a major version"
        echo >&2 "Run 'yarn release', push the branch, and try again"
        exit 1
      fi
    else
      echo ${branch} | sed -E 's/[^A-Za-z0-9_-]+/-/g'
      return
    fi
  fi

  local version=$(json <package.json .version)
  if is_tag ${ref} ; then
    local tag=$(ref_name ${ref})
    if [[ "$tag" != "v${version}" ]]; then
      # coherence check: tag should match version being deployed
      echo >&2 "Unexpected mismatch between tag '${tag}' and version '${version}'"
      exit 1
    fi
  fi

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


## main

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
  --max-workers 1 --non-interactive --release-channel "${channel}"
