#!/bin/bash

# Environment Validation Script for Schedulink
# This script validates that all environment variables are properly configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Environment Validation Check  ${NC}"
    echo -e "${BLUE}================================${NC}"
    echo
}

print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC}  $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

validate_file() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        print_status "$description exists"
        return 0
    else
        print_error "$description missing: $file"
        return 1
    fi
}

validate_env_var() {
    local file="$1"
    local var="$2"
    local description="$3"
    
    if [ -f "$file" ] && grep -q "^${var}=" "$file"; then
        local value=$(grep "^${var}=" "$file" | cut -d'=' -f2-)
        if [ -n "$value" ] && [ "$value" != "YOUR_${var}" ] && [ "$value" != "your-ec2-ip" ] && [ "$value" != "your-domain.com" ]; then
            print_status "$description is configured"
            return 0
        else
            print_warning "$description needs configuration in $file"
            return 1
        fi
    else
        print_error "$description missing in $file"
        return 1
    fi
}

validate_no_placeholders() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        local placeholders=$(grep -E "(your-ec2-ip|your-domain.com|your_password|YOUR_|your-)" "$file" 2>/dev/null || true)
        if [ -z "$placeholders" ]; then
            print_status "$description has no placeholders"
            return 0
        else
            print_warning "$description still contains placeholders:"
            echo "$placeholders" | sed 's/^/    /'
            return 1
        fi
    fi
}

main() {
    print_header
    
    local errors=0
    
    echo "📁 Checking required files..."
    validate_file ".env.production" "Main production environment file" || ((errors++))
    validate_file "frontend/.env.production" "Frontend production environment file" || ((errors++))
    validate_file "docker-compose.prod.yml" "Production Docker Compose file" || ((errors++))
    validate_file "deploy.sh" "Deployment script" || ((errors++))
    
    echo
    echo "🔧 Checking environment variables..."
    validate_env_var ".env.production" "EC2_PUBLIC_IP" "EC2 Public IP" || ((errors++))
    validate_env_var ".env.production" "DOMAIN_NAME" "Domain name" || ((errors++))
    validate_env_var ".env.production" "DB_PASSWORD" "Database password" || ((errors++))
    validate_env_var "frontend/.env.production" "VITE_API_URL" "Frontend API URL" || ((errors++))
    
    echo
    echo "🔍 Checking for placeholders..."
    validate_no_placeholders ".env.production" "Main environment file" || ((errors++))
    validate_no_placeholders "frontend/.env.production" "Frontend environment file" || ((errors++))
    validate_no_placeholders "docker-compose.prod.yml" "Docker Compose file" || ((errors++))
    
    echo
    echo "🌐 Checking network accessibility..."
    if [ -f ".env.production" ]; then
        local ec2_ip=$(grep "^EC2_PUBLIC_IP=" .env.production | cut -d'=' -f2)
        if [ -n "$ec2_ip" ]; then
            echo "Testing connection to $ec2_ip..."
            if ping -c 1 -W 3 "$ec2_ip" >/dev/null 2>&1; then
                print_status "EC2 instance is reachable"
            else
                print_warning "EC2 instance may not be reachable (this is normal if not running)"
            fi
        fi
    fi
    
    echo
    echo "📊 Validation Summary:"
    if [ $errors -eq 0 ]; then
        print_status "All validations passed! 🎉"
        echo
        echo -e "${GREEN}Your environment is ready for deployment!${NC}"
        echo "Run: ./deploy.sh"
    else
        print_error "Found $errors issue(s) that need attention"
        echo
        echo -e "${YELLOW}Fix the issues above before deploying.${NC}"
        echo "You can run: ./setup-env.sh to reconfigure"
        exit 1
    fi
}

# Execute if script is run directly
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
