#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma db push --accept-data-loss

echo "Seeding database..."
npx prisma db seed || echo "Seed already completed or failed"

echo "Starting application..."
exec node server.js
