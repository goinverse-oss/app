#!/bin/bash -e

now_name="theliturgists-fakeapi"
get_now_alias() {
  echo "theliturgists-fakeapi-branch-${CIRCLE_BRANCH}" | cut -c'-63'
}

run_now() {
  echo "Running: yarn now [auth] $@"
  yarn --silent now --token ${NOW_TOKEN} $@
}

run_now --public
run_now alias set $(get_now_alias)
