#!/bin/bash

# Script to commit the nginx configuration changes for MakeupByNuri

echo "Committing MakeupByNuri nginx configuration changes..."

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "Error: Not in a git repository"
    exit 1
fi

# Add the new/modified files
git add Dockerfile docker-compose.yml nginx.conf setup-nginx-ssl.sh DOCKER_SETUP.md

# Commit the changes
git commit -m "Add Docker and nginx configuration for MakeupByNuri

- Created Dockerfile for building the Next.js application
- Created docker-compose.yml for container orchestration
- Created nginx.conf for nginx reverse proxy configuration
- Created setup-nginx-ssl.sh for automated setup
- Updated DOCKER_SETUP.md with detailed instructions
- Fixed nginx configuration to properly serve MakeupByNuri on port 3003 with SSL"

echo "Changes committed successfully!"

# Ask if user wants to push
read -p "Do you want to push the changes to the remote repository? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push
    echo "Changes pushed successfully!"
else
    echo "Changes committed but not pushed. You can push later with 'git push'"
fi