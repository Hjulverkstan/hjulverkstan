FROM postgres:17-alpine

RUN apk add --no-cache aws-cli gnupg bash

WORKDIR /scripts

COPY postgres-backup-s3/backup.sh backup.sh
COPY postgres-backup-s3/restore.sh restore.sh

RUN chmod +x backup.sh restore.sh

ENTRYPOINT ["/bin/sh", "-c", "export -p | grep -v 'no_proxy' > /env.sh && echo \"${SCHEDULE:-0 0 * * *} . /env.sh; /bin/bash /scripts/backup.sh >> /var/log/cron.log 2>&1\" > /etc/crontabs/root && crond -f -l 2"]