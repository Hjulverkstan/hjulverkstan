ARG POSTGRES_VERSION=17
FROM postgres:${POSTGRES_VERSION}-alpine

COPY src/install.sh /install.sh
RUN sh /install.sh && rm /install.sh

WORKDIR /src

COPY src/run.sh run.sh
COPY src/env.sh env.sh
COPY src/backup.sh backup.sh
COPY src/restore.sh restore.sh

RUN chmod +x /src/*.sh

ENV POSTGRES_DATABASE='' \
    POSTGRES_HOST='' \
    POSTGRES_PORT=5432 \
    POSTGRES_USER='' \
    POSTGRES_PASSWORD='' \
    PGDUMP_EXTRA_OPTS='' \
    S3_BUCKET='' \
    S3_REGION='eu-north-1' \
    S3_PATH='backup' \
    S3_ENDPOINT='' \
    S3_S3V4='no' \
    SCHEDULE='' \
    PASSPHRASE='' \
    BACKUP_KEEP_DAYS='' \
    S3_PREFIX=''

ENTRYPOINT ["/bin/sh", "/src/run.sh"]