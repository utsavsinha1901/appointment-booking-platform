# AWS EC2 Deployment Guide for Schedulink

## Prerequisites

1. **AWS Account** with EC2 access
2. **Domain name** (optional but recommended)
3. **SSH Key Pair** for EC2 access

## Step 1: Launch EC2 Instance

### Instance Configuration:
- **AMI**: Ubuntu 22.04 LTS
- **Instance Type**: t3.medium (minimum) or t3.large (recommended)
- **Storage**: 20 GB GP3 SSD (minimum)
- **Security Group**: Create new with following rules:

### Security Group Rules:
```
Type            Protocol    Port Range    Source
SSH             TCP         22            Your IP
HTTP            TCP         80            0.0.0.0/0
HTTPS           TCP         443           0.0.0.0/0
Custom TCP      TCP         3000          0.0.0.0/0 (optional)
Custom TCP      TCP         8000          0.0.0.0/0 (optional)
PostgreSQL      TCP         5432          Security Group itself
```

## Step 2: Connect to EC2 Instance

```bash
# Connect via SSH
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Update system
sudo apt update && sudo apt upgrade -y
```

## Step 3: Install Git and Clone Repository

```bash
# Install Git
sudo apt install git -y

# Clone your repository
git clone https://github.com/your-username/Schedulink-Smart-Appointment-Scheduler.git
cd Schedulink-Smart-Appointment-Scheduler/Schedulink_Project
```

## Step 4: Configure Environment Variables

You have two options for configuring environment variables:

### Option A: Automated Setup (Recommended)
```bash
# Run the interactive environment setup script
./setup-env.sh

# This will automatically:
# - Detect your EC2 IP (if running on EC2)
# - Prompt for domain name
# - Generate secure passwords and keys
# - Update all configuration files
```

### Option B: Manual Configuration
```bash
# Edit the main environment file
nano .env.production

# Update these variables with your actual values:
EC2_PUBLIC_IP="3.111.170.237"  # Your actual EC2 IP
DOMAIN_NAME="manikandan.info"   # Your actual domain
DB_PASSWORD="your-secure-password"  # Strong database password

# Also update:
nano frontend/.env.production
nano docker-compose.prod.yml
```

## Step 5: Validate Configuration (Optional but Recommended)

```bash
# Run the validation script to check your setup
./validate-env.sh

# This will verify:
# - All required files exist
# - Environment variables are configured
# - No placeholder values remain
# - Network connectivity (if applicable)
```

## Step 6: Run Deployment Script

```bash
# Make script executable and run
chmod +x deploy.sh
./deploy.sh
```

## Step 7: Configure Domain (Optional)

If using a custom domain, update your DNS records:

```
Type    Name    Value
A       @       your-ec2-public-ip
A       www     your-ec2-public-ip
```

## Step 8: SSL Certificate (Automatic)

The deployment script will automatically set up SSL if you provide a domain name.

## Step 9: Test Deployment

```bash
# Check if services are running
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs

# Test endpoints
curl http://3.111.170.237/health
curl http://3.111.170.237:8000/health
```

## Step 10: Ongoing Maintenance

### Update Application:
```bash
cd /path/to/Schedulink_Project
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Database Backup:
```bash
# Backup PostgreSQL database
docker exec schedulink-db pg_dump -U schedulink_user -d schedulink_db > backup_$(date +%Y%m%d).sql
```

### View Logs:
```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs -f

# System logs
tail -f /var/log/schedulink_health.log
```

## Estimated Costs (Monthly)

### EC2 t3.medium (Oregon region):
- Instance: ~$30/month
- Storage (20GB): ~$2/month
- Data transfer: ~$1-5/month
- **Total: ~$33-37/month**

### EC2 t3.large (for higher traffic):
- Instance: ~$60/month
- Storage (20GB): ~$2/month
- Data transfer: ~$1-5/month
- **Total: ~$63-67/month**

## Security Best Practices

1. **Regular Updates**: Keep OS and packages updated
2. **Firewall**: Use AWS Security Groups restrictively
3. **SSL**: Always use HTTPS in production
4. **Database**: Use strong passwords and restrict access
5. **Monitoring**: Set up CloudWatch for monitoring
6. **Backups**: Regular automated backups
7. **Access**: Use IAM roles instead of access keys when possible

## Troubleshooting

### Common Issues:

1. **Services won't start**:
   ```bash
   docker-compose -f docker-compose.prod.yml logs
   ```

2. **Database connection issues**:
   ```bash
   docker exec -it schedulink-db psql -U schedulink_user -d schedulink_db
   ```

3. **SSL certificate issues**:
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

4. **Port issues**:
   ```bash
   sudo netstat -tlnp | grep :80
   sudo netstat -tlnp | grep :443
   ```

## Support

- Check application logs: `docker-compose logs`
- Check system resources: `htop`
- Check disk space: `df -h`
- Check network: `curl -I http://localhost:3000`

## Helper Scripts

The project includes several helper scripts to make deployment easier:

### setup-env.sh
Interactive environment configuration script:
```bash
./setup-env.sh
```
- Automatically detects EC2 IP (if running on EC2)
- Prompts for domain and database password
- Generates secure secret keys
- Updates all configuration files

### validate-env.sh
Environment validation script:
```bash
./validate-env.sh
```
- Checks all required files exist
- Validates environment variables
- Ensures no placeholder values remain
- Tests network connectivity

### deploy.sh
Main deployment script:
```bash
./deploy.sh
```
- Installs all required dependencies
- Configures Docker and containers
- Sets up SSL certificates
- Deploys the application

### Quick Start
```bash
# 1. Configure environment
./setup-env.sh

# 2. Validate configuration
./validate-env.sh

# 3. Deploy
./deploy.sh
```
