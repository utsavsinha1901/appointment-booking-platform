#!/bin/bash

# AWS EC2 Deployment Script for Schedulink

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🚀 Starting Schedulink deployment on AWS EC2..."

# Load environment variables from .env.production
if [ -f .env.production ]; then
    print_status "Loading environment variables from .env.production..."
    export $(grep -v '^#' .env.production | xargs)
else
    print_error ".env.production file not found. Please create it with your configuration."
    exit 1
fi

# Use environment variables (with fallbacks for manual override)
EC2_PUBLIC_IP="${EC2_PUBLIC_IP:-3.111.170.237}"
DOMAIN_NAME="${DOMAIN_NAME:-manikandan.info}"
DB_PASSWORD="${DB_PASSWORD:-Mani@983}"

# Check if running on EC2
check_ec2() {
    print_status "Checking if running on EC2..."
    if curl -s --max-time 3 http://169.254.169.254/latest/meta-data/ > /dev/null; then
        print_status "✅ Running on EC2 instance"
    else
        print_warning "⚠️  Not running on EC2, continuing anyway..."
    fi
}

# Update system packages
update_system() {
    print_status "Updating system packages..."
    sudo apt-get update -y
    sudo apt-get upgrade -y
}

# Install Docker and Docker Compose
install_docker() {
    print_status "Installing Docker and Docker Compose..."
    
    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    
    # Install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    # Verify installation
    docker --version
    docker-compose --version
}

# Install additional tools
install_tools() {
    print_status "Installing additional tools..."
    sudo apt-get install -y \
        nginx \
        certbot \
        python3-certbot-nginx \
        htop \
        curl \
        wget \
        git \
        vim
}

# Configure environment variables
configure_env() {
    print_status "Configuring environment variables..."
    
    # Update docker-compose.prod.yml with actual values
    sed -i "s/your-ec2-ip/$EC2_PUBLIC_IP/g" docker-compose.prod.yml
    sed -i "s/your_password/$DB_PASSWORD/g" docker-compose.prod.yml
    
    if [ ! -z "$DOMAIN_NAME" ]; then
        sed -i "s/your-domain.com/$DOMAIN_NAME/g" docker-compose.prod.yml
        sed -i "s/your-domain.com/$DOMAIN_NAME/g" nginx.conf
    fi
    
    sed -i "s/your-ec2-ip/$EC2_PUBLIC_IP/g" nginx.conf
}

# Configure firewall
configure_firewall() {
    print_status "Configuring firewall..."
    sudo ufw allow 22     # SSH
    sudo ufw allow 80     # HTTP
    sudo ufw allow 443    # HTTPS
    sudo ufw allow 3000   # Frontend (optional, for direct access)
    sudo ufw allow 8000   # Backend (optional, for direct access)
    sudo ufw --force enable
}

# Setup SSL certificate (optional)
setup_ssl() {
    if [ ! -z "$DOMAIN_NAME" ]; then
        print_status "Setting up SSL certificate for $DOMAIN_NAME..."
        sudo certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos --email admin@$DOMAIN_NAME
    else
        print_warning "No domain name provided, skipping SSL setup"
    fi
}

# Deploy application
deploy_app() {
    print_status "Deploying Schedulink application..."
    
    # Build and start containers
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml build
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to start
    print_status "Waiting for services to start..."
    sleep 30
    
    # Check if services are running
    docker-compose -f docker-compose.prod.yml ps
}

# Setup monitoring
setup_monitoring() {
    print_status "Setting up basic monitoring..."
    
    # Create a simple health check script
    cat > /tmp/health_check.sh << 'EOF'
#!/bin/bash
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)

echo "$(date): Frontend: $FRONTEND_STATUS, Backend: $BACKEND_STATUS" >> /var/log/schedulink_health.log

if [ "$FRONTEND_STATUS" != "200" ] || [ "$BACKEND_STATUS" != "200" ]; then
    echo "$(date): Service down, attempting restart" >> /var/log/schedulink_health.log
    cd /home/ubuntu/Schedulink_Project && docker-compose -f docker-compose.prod.yml restart
fi
EOF
    
    sudo mv /tmp/health_check.sh /usr/local/bin/
    sudo chmod +x /usr/local/bin/health_check.sh
    
    # Add to crontab (check every 5 minutes)
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/health_check.sh") | crontab -
}

# Main deployment flow
main() {
    print_status "🎯 Starting Schedulink deployment..."
    
    check_ec2
    update_system
    install_docker
    install_tools
    configure_env
    configure_firewall
    deploy_app
    setup_monitoring
    
    if [ ! -z "$DOMAIN_NAME" ]; then
        setup_ssl
    fi
    
    print_status "🎉 Deployment completed successfully!"
    print_status "📱 Frontend: http://$EC2_PUBLIC_IP:3000"
    print_status "🔧 Backend API: http://$EC2_PUBLIC_IP:8000"
    print_status "📚 API Docs: http://$EC2_PUBLIC_IP:8000/docs"
    
    if [ ! -z "$DOMAIN_NAME" ]; then
        print_status "🌐 Domain: https://$DOMAIN_NAME"
    fi
    
    print_warning "⚠️  Remember to:"
    print_warning "   1. Update security groups in AWS Console"
    print_warning "   2. Configure your domain's DNS if using custom domain"
    print_warning "   3. Update the database password in production"
    print_warning "   4. Set up regular backups"
}

# Run main function
main "$@"
