#!/bin/bash

# Environment Setup Script for Schedulink
# This script helps configure environment variables for deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Schedulink Environment Setup  ${NC}"
    echo -e "${BLUE}================================${NC}"
    echo
}

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get EC2 public IP automatically
get_ec2_ip() {
    local ec2_ip
    if curl -s --max-time 3 http://169.254.169.254/latest/meta-data/public-ipv4 > /dev/null 2>&1; then
        ec2_ip=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
        echo "$ec2_ip"
    else
        echo ""
    fi
}

# Interactive configuration
configure_environment() {
    print_header
    
    # Try to detect EC2 IP automatically
    auto_ec2_ip=$(get_ec2_ip)
    
    echo "📝 Let's configure your environment variables..."
    echo
    
    # EC2 Public IP
    if [ -n "$auto_ec2_ip" ]; then
        echo -e "Detected EC2 Public IP: ${GREEN}$auto_ec2_ip${NC}"
        read -p "Use this IP? (y/n) [y]: " use_auto_ip
        use_auto_ip=${use_auto_ip:-y}
        
        if [[ $use_auto_ip =~ ^[Yy]$ ]]; then
            EC2_IP="$auto_ec2_ip"
        else
            read -p "Enter your EC2 Public IP: " EC2_IP
        fi
    else
        echo "Current EC2 IP: 3.111.170.237"
        read -p "Enter your EC2 Public IP [3.111.170.237]: " EC2_IP
        EC2_IP=${EC2_IP:-3.111.170.237}
    fi
    
    # Domain name
    echo
    echo "Current domain: manikandan.info"
    read -p "Enter your domain name (optional) [manikandan.info]: " DOMAIN
    DOMAIN=${DOMAIN:-manikandan.info}
    
    # Database password
    echo
    echo "⚠️  Current database password is visible in files"
    read -s -p "Enter a secure database password: " DB_PASS
    echo
    
    # Generate a random secret key
    SECRET_KEY=$(openssl rand -base64 32 2>/dev/null || echo "$(date +%s | sha256sum | base64 | head -c 32)")
    
    # Confirmation
    echo
    echo "📋 Configuration Summary:"
    echo "  EC2 IP: $EC2_IP"
    echo "  Domain: $DOMAIN"
    echo "  Database Password: [hidden]"
    echo "  Secret Key: [generated]"
    echo
    
    read -p "Proceed with this configuration? (y/n) [y]: " confirm
    confirm=${confirm:-y}
    
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo "Configuration cancelled."
        exit 0
    fi
    
    # Update environment files
    update_env_files "$EC2_IP" "$DOMAIN" "$DB_PASS" "$SECRET_KEY"
}

# Update all environment files
update_env_files() {
    local ec2_ip="$1"
    local domain="$2"
    local db_pass="$3"
    local secret="$4"
    
    print_status "Updating environment files..."
    
    # Update main .env.production
    cat > .env.production << EOF
# Production Environment Variables
DATABASE_URL=postgresql://schedulink_user:${db_pass}@localhost:5432/schedulink_db
SECRET_KEY=${secret}
ENVIRONMENT=production
DEBUG=false

# EC2 and Domain Configuration
EC2_PUBLIC_IP=${ec2_ip}
DOMAIN_NAME=${domain}

# Frontend URL
FRONTEND_URL=http://${ec2_ip}:3000

# Backend settings
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# Database settings (for PostgreSQL in production)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=schedulink_db
DB_USER=schedulink_user
DB_PASSWORD=${db_pass}

# CORS settings
ALLOWED_ORIGINS=http://${ec2_ip}:3000,https://${domain}
EOF
    
    # Update frontend .env.production
    cat > frontend/.env.production << EOF
# Production environment variables for frontend
VITE_API_URL=http://${ec2_ip}:8000
VITE_APP_TITLE=Schedulink - Production
VITE_ENVIRONMENT=production
EOF
    
    # Update docker-compose.prod.yml environment variables
    sed -i.bak "s/\${EC2_PUBLIC_IP}/${ec2_ip}/g" docker-compose.prod.yml
    sed -i.bak "s/\${DOMAIN_NAME:-localhost}/${domain}/g" docker-compose.prod.yml
    sed -i.bak "s/\${DB_PASSWORD}/${db_pass}/g" docker-compose.prod.yml
    sed -i.bak "s/\${FRONTEND_URL}/http:\/\/${ec2_ip}:3000/g" docker-compose.prod.yml
    
    print_status "✅ Environment files updated successfully!"
    print_status "📁 Updated files:"
    print_status "   - .env.production"
    print_status "   - frontend/.env.production"
    print_status "   - docker-compose.prod.yml"
    
    echo
    print_warning "🔒 Security reminder:"
    print_warning "   - Keep your .env.production file secure"
    print_warning "   - Don't commit sensitive data to version control"
    print_warning "   - Use strong passwords and rotate them regularly"
    
    echo
    print_status "🚀 You can now run: ./deploy.sh"
}

# Main execution
main() {
    if [ "$1" = "--auto" ]; then
        # Auto mode using existing values
        if [ -f .env.production ]; then
            print_status "Auto mode: Using existing configuration"
            exit 0
        else
            print_error "No existing configuration found. Run without --auto flag."
            exit 1
        fi
    else
        # Interactive mode
        configure_environment
    fi
}

# Check if script is being executed
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
