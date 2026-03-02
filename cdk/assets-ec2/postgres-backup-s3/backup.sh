#!/bin/bash
set -e

# Load env vars for cron
[ -f "/env.sh" ] && . /env.sh

TIMESTAMP=$(date +"%Y-%m-%dT%H:%M:%S")
FILE_NAME="${POSTGRES_DATABASE}_${TIMESTAMP}.dump"
S3_URI="s3://${S3_BUCKET}/${S3_PREFIX:-backup}/${FILE_NAME}.gpg"

export PGPASSWORD=$POSTGRES_PASSWORD

echo "--- Starting backup of $POSTGRES_DATABASE ---"

pg_dump -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DATABASE" -Fc > db.dump

echo "Encrypting backup..."
gpg --symmetric --batch --passphrase "$PASSPHRASE" --output db.dump.gpg db.dump
rm db.dump

echo "Uploading to $S3_URI..."
aws s3 cp db.dump.gpg "$S3_URI"

rm db.dump.gpg
echo "--- Backup complete ---"