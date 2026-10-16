#!/bin/sh
set -e

echo "==> Preparing database schema..."
npx prisma db push --skip-generate

echo "==> Checking seed data..."
node scripts/seed-runner.js

echo "==> Launching Disability Digest on port ${PORT:-3000}..."
exec "$@"
