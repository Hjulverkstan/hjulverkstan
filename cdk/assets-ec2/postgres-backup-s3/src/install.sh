#! /bin/sh

set -eux
set -o pipefail

apk update

# install tools
apk add gnupg aws-cli curl

# cleanup
rm -rf /var/cache/apk/*
