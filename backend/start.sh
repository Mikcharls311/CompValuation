#!/bin/bash
set -e

PORT=${PORT:-8000}

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
