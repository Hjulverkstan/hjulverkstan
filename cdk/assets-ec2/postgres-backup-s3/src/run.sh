#! /bin/sh

set -eu

export -p > /src/docker_env.sh

if [ -z "$SCHEDULE" ]; then
    echo "No SCHEDULE set, running backup once..."
    sh /src/backup.sh
else
    echo "Setting up cron schedule: $SCHEDULE"

    echo "$SCHEDULE . /src/docker_env.sh && cd /src && /bin/sh backup.sh > /proc/1/fd/1 2>&1" > /var/spool/cron/crontabs/root

    echo "Starting crond..."
    exec crond -f -l 2
fi