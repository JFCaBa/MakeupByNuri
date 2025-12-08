# DOCKER DEPLOYMENT CONFIGURATION
# 
# To deploy this application using Docker, please follow these steps:
#
# 1. Update the domain name in nginx.conf:
#    - Replace "YOUR_DOMAIN_NAME" with your actual domain name
#
# 2. Update the certbot configuration in docker-compose.yml:
#    - Replace "your-email@example.com" with your actual email
#    - Replace "your-domain.com" with your actual domain name
#
# 3. Make sure your DNS is pointing to the server where you're deploying
#
# 4. Run the following commands:
#    - docker-compose up -d
#    - Wait for the containers to start
#    - If using SSL, run certbot to obtain certificates:
#      docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email YOUR_EMAIL --agree-tos --no-eff-email -d YOUR_DOMAIN
#
# 5. The application will be accessible via your domain name