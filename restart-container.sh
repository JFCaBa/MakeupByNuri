#!/bin/bash

# Script to stop, rebuild, and restart containers using docker compose

echo "Stopping and removing containers..."
docker compose down

echo "Building and starting containers..."
docker compose up -d --build

echo "Containers restarted successfully!"