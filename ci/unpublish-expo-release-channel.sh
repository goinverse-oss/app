#!/bin/bash -e

source $(dirname $0)/common.inc

branch_name=$1
channel=$(get_release_channel refs/heads/${branch_name})

# Here's where we'd unpublish the release channel if we could...
# ...but expo doesn't provide a way to do that, for some reason.
# So instead, we just print a message about it.

echo "If expo supported deleting release channels, we'd delete ${channel} right now."
echo ""
echo "Maybe someday."
