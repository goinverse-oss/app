#!/bin/bash -e

default_changelog=CHANGELOG.md

usage() {
  echo >&2 "Usage: $0 [-s]"
  echo >&2 ""
  echo >&2 "Print just the most recent changelog entry."
  echo >&2 ""
  echo >&2 "Options:"
  echo >&2 "  -f    Path to changelog file (default: ${default_changelog})"
  exit 1
}

changelog=${default_changelog}
while getopts ":f:" opt; do
  case ${opt} in
    f) changelog=${OPTARG} ;;
    :) echo >&2 "Invalid option: $OPTARG requires an argument\n"; usage ;;
    \?) usage ;;
  esac
done

shift $((OPTIND -1))


# From https://github.com/conventional-changelog/standard-version/issues/568
# This regex looks for a version header ('### [x.y.z]()') followed by either
# another version header or EOF, thereby extracting just the most recent
# changelog entry.
rexreplace "#+\s\[?\d\.\d\.\d[^\n]*?\n.*?(?=\s*#+\s\[?\d\.\d\.\d|$)" "_" -s -M -G -m -o ${changelog}
