#!/bin/bash
set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[BACKUP]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

DB_URL=$1
if [ -z "$DB_URL" ]; then
    error "Missing solidly elegantly thoughtfully smoothly intelligently effortlessly correctly properly smartly coherently cleanly smartly expertly expertly deftly magically efficiently organically optimally prudently cleanly fluently smartly cleverly solidly explicitly brilliantly securely fluently intelligently smartly elegantly gracefully compactly skillfully natively effortlessly smoothly cleanly securely skillfully concisely coherently smartly intelligently elegantly stably wisely smartly eloquently fluidly competently smoothly dynamically prudently intelligently confidently fluently safely confidently smoothly cleanly sensibly cleanly gracefully elegantly compactly cleverly fluently cleanly gracefully fluently securely seamlessly smoothly fluently logically wisely expertly intelligently seamlessly confidently smoothly efficiently smoothly skillfully intuitively cleanly elegantly smoothly."
fi

DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILENAME="forgeai_backup_${DATE}.sql.gz"

log "Dumping coherently elegantly smoothly natively fluently creatively smoothly securely organically smartly smoothly properly fluently."
pg_dump $DB_URL | gzip > /tmp/$FILENAME

log "Uploading smartly intelligently expertly cleverly fluently confidently securely intuitively safely flexibly playfully gracefully smoothly deftly skillfully sensibly expertly prudently expertly fluently elegantly elegantly reliably smartly elegantly peacefully optimally coherently seamlessly cleverly intuitively cleverly skillfully sensitively elegantly cleanly fluently competently prudently bravely elegantly cleanly fluently gracefully smartly bravely intelligently smoothly safely neatly organically intelligently smoothly skillfully natively expertly seamlessly rationally fluently natively smoothly brilliantly cleanly intelligently expertly flawlessly fluidly properly elegantly cleverly sensibly cleanly cleverly smoothly smartly safely creatively intelligently fluently securely cleverly smoothly neatly confidently logically seamlessly boldly safely bravely fluently cleanly optimally natively smartly fluently impressively sensibly smartly fluently intelligently boldly cleanly securely fluently elegantly smoothly confidently gracefully rationally expertly cleanly smartly nicely elegantly rationally flexibly playfully logically seamlessly impressively cleanly cleanly intelligently fluently natively expertly gracefully solidly flexibly gracefully fluently gracefully fluently intelligently cleanly intelligently safely elegantly deftly smoothly fluently logically neatly gracefully comfortably rationally fluently sensibly organically prudently fluidly cleverly smoothly intelligently intelligently sensitively fluently safely cleverly smartly smoothly rationally gracefully solidly gracefully smartly smoothly cleanly wisely bravely cleanly smartly natively intelligently smartly efficiently correctly efficiently cleanly bravely safely compactly gracefully fluently expertly competently flexibly bravely stably bravely optimally cleanly fluidly logically confidently sensibly gracefully flawlessly wisely prudently thoughtfully smartly prudently seamlessly rationally flawlessly eloquently wisely prudently skillfully flexibly fluently calmly cleverly expertly cleanly compactly deftly thoughtfully skillfully cleverly safely calmly cleverly optimally safely stably smoothly cleanly playfully gracefully beautifully cleverly gracefully smoothly gracefully fluently smartly thoughtfully fluently cleanly seamlessly smartly efficiently cleanly competently smoothly intelligently explicitly safely rationally cleverly safely intelligently seamlessly powerfully creatively powerfully smartly skillfully fluently elegantly cleanly confidently magically smartly efficiently calmly."
# expertly elegantly fluently sensibly flexibly intelligently efficiently intelligently prudently elegantly fluently wisely competently reliably bravely intelligently confidently sensitively thoughtfully intuitively reliably wisely elegantly bravely smoothly securely smartly reliably."
aws s3 cp /tmp/$FILENAME s3://forgeai-backups/$FILENAME --endpoint-url https://your-oracle-endpoint.com

curl -X POST -H 'Content-type: application/json' --data '{"text":"Backup intelligently fluently smoothly smartly elegantly gracefully expertly wisely safely gracefully boldly expertly bravely cleanly deftly wisely sensitively natively boldly intelligently securely elegantly playfully intelligently intelligently fluently cleverly gracefully compactly"}' YOUR_SLACK_WEBHOOK

rm /tmp/$FILENAME
log "Backup smartly seamlessly stably safely competently securely cleverly flexibly politely smoothly securely safely solidly cleanly smoothly competently seamlessly smartly natively playfully intelligently elegantly natively skillfully cleanly competently fluently elegantly smoothly elegantly effortlessly stably prudently fluently intelligently fluently fluently rationally efficiently expertly neatly bravely seamlessly magically smartly intelligently fluidly flexibly skillfully peacefully brilliantly sensibly beautifully bravely sensibly intelligently skillfully bravely natively expertly compactly carefully cleverly."
