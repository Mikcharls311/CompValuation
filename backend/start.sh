#!/bin/bash
set -e

PORT=${PORT:-8000}
MAX_RETRIES=30
RETRY_DELAY=2

wait_for_db() {
    echo "Waiting for database to be ready..."
    local attempt=1
    while [ $attempt -le $MAX_RETRIES ]; do
        if python -c "
import asyncio, sys
async def check():
    try:
        from app.database import engine
        async with engine.connect() as conn:
            await conn.execute(__import__('sqlalchemy').text('SELECT 1'))
        return True
    except Exception as e:
        print(f'DB not ready (attempt $attempt/$MAX_RETRIES): {e}', file=sys.stderr)
        return False
sys.exit(0 if asyncio.run(check()) else 1)
" 2>&1; then
            echo "Database is ready."
            return 0
        fi
        echo "Retrying in ${RETRY_DELAY}s..."
        sleep $RETRY_DELAY
        attempt=$((attempt + 1))
    done
    echo "ERROR: Database not reachable after $MAX_RETRIES attempts."
    echo "Make sure DATABASE_URL is set correctly in your environment."
    exit 1
}

wait_for_db

echo "Running database initialization..."
python -c "import asyncio; from app.database import init_db; asyncio.run(init_db())"

echo "Seeding database..."
python -c "import asyncio; from app.utils.seed import seed_database; asyncio.run(seed_database())"

echo "Starting gunicorn on port $PORT..."
exec gunicorn app.main:app \
    -w 2 \
    -k uvicorn.workers.UvicornWorker \
    --bind "0.0.0.0:$PORT" \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
