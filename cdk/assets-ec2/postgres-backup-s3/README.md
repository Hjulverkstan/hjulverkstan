# Postgres S3 Backup & Restore

Commands

Create a manual backup:
```bash
docker exec backup sh backup.sh
```

Restore the latest backup from S3:

```bash
docker exec -it backup sh restore.sh
```

Restore a specific file from S3:
```bash
docker exec -it backup sh restore.sh filename.dump.gpg
```