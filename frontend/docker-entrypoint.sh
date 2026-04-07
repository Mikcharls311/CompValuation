#!/bin/sh
set -e

PORT=${PORT:-80}
BACKEND_URL=${BACKEND_URL:-http://localhost:8000}

# Export for envsubst
export PORT
export BACKEND_URL

echo "Starting nginx on port $PORT, proxying API to $BACKEND_URL"

# Process nginx config template
envsubst '${PORT} ${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx in foreground
exec nginx -g "daemon off;"
