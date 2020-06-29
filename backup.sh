BACKUP_TIMESTAMP=$(date -u --date "now" +"%Y-%m-%dT%H:%M:%SZ")
BACKUP_FILENAME="origami_backup_$BACKUP_TIMESTAMP.gz"

/usr/bin/docker-compose -f /home/ubuntu/origami-backend/docker-compose.yml exec -T mongo mongodump --archive --gzip --db origami >$BACKUP_FILENAME

curl --user "username:password" -T $BACKUP_FILENAME "https://cloud.reedu.de/remote.php/webdav/origami-backup/$BACKUP_FILENAME" --basic

rm -rf $BACKUP_FILENAME
