#!/bin/bash

echo "Setting up MakeupByNuri project with nginx and certbot"
echo "====================================================="

# Check if domain name was provided
if [ -z "$1" ]; then
    echo "Usage: $0 <your-domain.com>"
    echo "Example: $0 makeupbynuri.example.com"
    exit 1
fi

DOMAIN=$1
EMAIL=$2

if [ -z "$EMAIL" ]; then
    echo "Please provide an email address for certbot:"
    read -r EMAIL
fi

echo "Domain: $DOMAIN"
echo "Email: $EMAIL"

# Build the Docker image
echo "Building Docker image..."
docker build -t makeupbynuri .

# Run the Next.js application container
echo "Starting MakeupByNuri application..."
docker run -d --name makeupbynuri-app -p 3003:3000 makeupbynuri

# Wait a moment for the app to start
sleep 5

# Test if the container is running
if ! docker ps | grep -q makeupbynuri-app; then
    echo "Failed to start the MakeupByNuri application container"
    exit 1
fi

echo "MakeupByNuri application is running on port 3003"

# Create the nginx configuration file for this domain
cat > /tmp/$DOMAIN.conf << EOF
server {
    server_name $DOMAIN www.$DOMAIN;

    # For Let's Encrypt ACME challenges
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files \$uri \$uri/ =404;
    }

    # Main proxy to Next.js app
    location / {
        proxy_pass http://localhost:3003;  # Points to our Docker container
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
server {
    if (\$host = www.$DOMAIN) {
        return 301 https://\$host\$request_uri;
    } # managed by Certbot


    if (\$host = $DOMAIN) {
        return 301 https://\$host\$request_uri;
    } # managed by Certbot


    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    return 404; # managed by Certbot
}
EOF

echo "Created nginx configuration file for $DOMAIN"

echo "Before proceeding with SSL certificate creation, please ensure:"
echo "1. The domain $DOMAIN points to this server's IP address"
echo "2. Port 80 is accessible from the internet"
echo ""
echo "Press Enter to continue with SSL certificate setup using certbot, or Ctrl+C to cancel"
read -r

# Run certbot to get SSL certificate
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL

echo "SSL certificate setup complete. Please verify the nginx configuration at /etc/nginx/conf.d/$DOMAIN.conf"

echo ""
echo "Setup complete! Your MakeupByNuri site should be available at https://$DOMAIN"
echo ""
echo "To stop the application: docker stop makeupbynuri-app"
echo "To start it again: docker start makeupbynuri-app"
echo "To remove the container: docker rm makeupbynuri-app"