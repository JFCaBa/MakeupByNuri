# MakeupByNuri - Docker and Nginx Setup

This project is a Next.js 15 application for "Maquillaje Profesional" (Professional Makeup), designed to promote professional makeup services.

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed
- Nginx installed and running
- Certbot installed for SSL certificates
- Domain name pointing to your server's IP address
- Ports 80 and 443 accessible from the internet

### Automated Setup

1. Make sure you have updated the domain name in `setup-nginx-ssl.sh` script

2. Run the setup script:
   ```bash
   ./setup-nginx-ssl.sh your-domain.com your-email@example.com
   ```

   Example:
   ```bash
   ./setup-nginx-ssl.sh makeupbynuri.com info@makeupbynuri.com
   ```

3. The script will:
   - Build the Docker image
   - Start the application container
   - Create the nginx configuration
   - Obtain SSL certificate using Certbot

### Manual Setup (Alternative)

If you prefer to set up manually:

1. Build the Docker image:
   ```bash
   docker build -t makeupbynuri .
   ```

2. Run the application:
   ```bash
   docker run -d --name makeupbynuri-app -p 3003:3000 makeupbynuri
   ```

3. Create an nginx configuration file for your domain in `/etc/nginx/conf.d/`:
   ```
   # HTTP server - redirect to HTTPS
   server {
       listen 80;
       listen [::]:80;
       server_name makeupbynuri.com www.makeupbynuri.com;

       # For Let's Encrypt ACME challenges
       location /.well-known/acme-challenge/ {
           root /var/www/certbot;
           try_files $uri $uri/ =404;
       }

       # Redirect to HTTPS
       return 301 https://$host$request_uri;
   }

   # HTTPS server - main configuration
   server {
       listen 443 ssl http2;
       listen [::]:443 ssl http2;
       server_name makeupbynuri.com www.makeupbynuri.com;

       # SSL configuration
       ssl_certificate /etc/letsencrypt/live/makeupbynuri.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/makeupbynuri.com/privkey.pem;
       include /etc/letsencrypt/options-ssl-nginx.conf;
       ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

       # Main proxy to Next.js app
       location / {
           proxy_pass http://localhost:3003;  # Points to our Docker container
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
           
           # Handle Next.js specific headers
           proxy_set_header Accept-Encoding "";
       }

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
   }
   ```

4. Obtain SSL certificate:
   ```bash
   sudo certbot --nginx -d makeupbynuri.com -d www.makeupbynuri.com --non-interactive --agree-tos --email info@makeupbynuri.com
   ```

5. Reload nginx:
   ```bash
   sudo nginx -s reload
   ```

### Updating the Application

To update the application with new code:

1. Stop the running container:
   ```bash
   docker stop makeupbynuri-app
   ```

2. Remove the old container:
   ```bash
   docker rm makeupbynuri-app
   ```

3. Rebuild the image:
   ```bash
   docker build -t makeupbynuri .
   ```

4. Start a new container:
   ```bash
   docker run -d --name makeupbynuri-app -p 3003:3000 makeupbynuri
   ```

### Management Commands

- View container logs: `docker logs makeupbynuri-app`
- Stop the application: `docker stop makeupbynuri-app`
- Start the application: `docker start makeupbynuri-app`
- Remove the container: `docker rm makeupbynuri-app`
- Check if container is running: `docker ps | grep makeupbynuri-app`

### Troubleshooting

1. If the site doesn't load, check if the domain points to your server's IP address
2. Make sure ports 80 and 443 are open in your firewall
3. Verify that the Docker container is running: `docker ps`
4. Check the container logs: `docker logs makeupbynuri-app`
5. Validate your nginx configuration: `sudo nginx -t`
6. If SSL certificate shows for a different domain, verify there are no conflicting server blocks in nginx configuration files

## Project Information

This is a Next.js 15 application for "Maquillaje Profesional" (Professional Makeup), featuring:
- Responsive design with pink and black color scheme
- Image gallery with lightbox functionality
- Contact form with validation
- Service showcase with detailed descriptions
- Testimonials section
- Dark/light mode support
- SEO optimization
- Accessibility features (WCAG compliant)