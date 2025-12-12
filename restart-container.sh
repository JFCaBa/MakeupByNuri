#!/bin/bash

# Script to stop container, rebuild image, and run container again

echo "Stopping and removing container..."
docker stop makeupbynuri-app && docker rm makeupbynuri-app

echo "Building new image..."
docker build -t makeupbynuri .

echo "Starting container..."
docker run -d --name makeupbynuri-app -p 3003:3000 makeupbynuri

echo "Container restarted successfully!"