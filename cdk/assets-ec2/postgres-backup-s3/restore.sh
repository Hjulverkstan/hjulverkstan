#!/bin/bash
set -e

[ -f "/env.sh" ] && . /env.sh

export PGPASSWORD=$POSTGRES_PASSWORD
S3_PATH="s3://${S3_BUCKET}/${S3_PREFIX:-backup}/"

if [ -z "$1" ]; then
    echo "Finding latest backup on S3..."
    LAST_FILE=$(aws s3 ls "$S3_PATH" | sort | tail -n 1 | awk '{print $4}')
else
    LAST_FILE=$1
fi

if [ -z "$LAST_FILE" ]; then
    echo "No backup file found."
    exit 1
fi

echo "Fetching $LAST_FILE from S3..."
aws s3 cp "${S3_PATH}${LAST_FILE}" "restore_tmp"

if [[ "$LAST_FILE" == *.gpg ]]; then
    echo "Decrypting..."
    gpg --decrypt --batch --passphrase "$PASSPHRASE" --output db.restore restore_tmp
    rm restore_tmp
else
    mv restore_tmp db.restore
fi

echo "Restoring database..."
pg_restore -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DATABASE" --clean --if-exists db.restore

rm db.restore
echo "--- Restore complete ---"