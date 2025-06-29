# Raisket Mexican Fintech Platform - Production Deployment Guide

## 🚀 Complete Step-by-Step Deployment Instructions

This guide will help you deploy the Raisket Mexican Fintech Platform to production with enterprise-grade security, scalability, and compliance.

## 📋 Prerequisites

### Required Accounts & Services
- [ ] AWS Account with appropriate permissions
- [ ] GitHub account with repository access
- [ ] Domain name (e.g., `raisket.mx`)
- [ ] SSL certificates for production domains
- [ ] Buró de Crédito API credentials
- [ ] Claude API key from Anthropic
- [ ] Datadog account for monitoring
- [ ] SendGrid account for email services
- [ ] Twilio account for SMS services

### Required Tools
- [ ] Docker Desktop or Docker Engine
- [ ] kubectl (Kubernetes CLI)
- [ ] AWS CLI v2
- [ ] Terraform >= 1.0
- [ ] Node.js >= 18
- [ ] Git
- [ ] OpenSSL for certificate generation

## 🏗️ Phase 1: Infrastructure Setup

### Step 1: Clone Repository and Setup

```bash
# Clone the repository
git clone https://github.com/your-org/raisket-fintech-mx.git
cd raisket-fintech-mx

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

### Step 2: Configure AWS Infrastructure

```bash
# Configure AWS CLI
aws configure
# Enter your AWS Access Key ID, Secret, Region (us-east-1), and output format (json)

# Initialize Terraform
cd infrastructure/terraform/environments/production
terraform init

# Review and customize variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your specific values

# Plan infrastructure
terraform plan

# Apply infrastructure (this will take 15-30 minutes)
terraform apply
```

### Step 3: Setup Kubernetes Cluster

```bash
# Update kubeconfig
aws eks update-kubeconfig --name raisket-production-cluster --region us-east-1

# Verify cluster access
kubectl get nodes

# Install necessary operators
kubectl apply -f infrastructure/kubernetes/operators/
```

### Step 4: Setup Domain and SSL

```bash
# Create SSL certificates (if not using AWS ACM)
openssl genrsa -out raisket.mx.key 2048
openssl req -new -key raisket.mx.key -out raisket.mx.csr
# Submit CSR to your certificate authority

# Create Kubernetes secrets for SSL
kubectl create secret tls raisket-tls \
  --cert=raisket.mx.crt \
  --key=raisket.mx.key \
  -n raisket-production
```

## 🗄️ Phase 2: Database Setup

### Step 1: Create Production Database

```bash
# Connect to RDS instance (get endpoint from Terraform output)
export DB_ENDPOINT=$(terraform output -raw database_endpoint)
export DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id raisket-db-password --query SecretString --output text)

# Create database and user
psql -h $DB_ENDPOINT -U postgres -c "CREATE DATABASE raisket_production;"
psql -h $DB_ENDPOINT -U postgres -c "CREATE USER raisket_user WITH ENCRYPTED PASSWORD '$DB_PASSWORD';"
psql -h $DB_ENDPOINT -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE raisket_production TO raisket_user;"
```

### Step 2: Run Database Migrations

```bash
# Run schema creation
psql -h $DB_ENDPOINT -U raisket_user -d raisket_production -f database/migrations/001_initial_schema.sql

# Run indexes and constraints
psql -h $DB_ENDPOINT -U raisket_user -d raisket_production -f database/migrations/002_indexes_and_constraints.sql

# Seed production data
psql -h $DB_ENDPOINT -U raisket_user -d raisket_production -f database/seeds/production/001_institutions.sql
```

### Step 3: Setup Database Backup

```bash
# Create backup bucket
aws s3 mb s3://raisket-mx-backups-$(date +%Y%m%d)

# Configure automated backups
kubectl apply -f infrastructure/kubernetes/cronjobs/database-backup.yaml
```

## 🔐 Phase 3: Security Setup

### Step 1: Create Secrets

```bash
# Generate encryption keys
export ENCRYPTION_KEY=$(openssl rand -hex 32)
export JWT_PRIVATE_KEY=$(openssl genpkey -algorithm RSA -out - -pkcs8 | base64 -w 0)

# Create Kubernetes secrets
kubectl create secret generic raisket-secrets \
  --from-literal=database-password="$DB_PASSWORD" \
  --from-literal=encryption-key="$ENCRYPTION_KEY" \
  --from-literal=jwt-private-key="$JWT_PRIVATE_KEY" \
  --from-literal=claude-api-key="$CLAUDE_API_KEY" \
  --from-literal=buro-client-id="$BURO_CLIENT_ID" \
  --from-literal=buro-client-secret="$BURO_CLIENT_SECRET" \
  -n raisket-production
```

### Step 2: Setup Certificate Management

```bash
# Install cert-manager for automatic SSL renewal
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Configure Let's Encrypt issuer
kubectl apply -f infrastructure/kubernetes/cert-manager/production-issuer.yaml
```

### Step 3: Configure Network Security

```bash
# Apply network policies
kubectl apply -f infrastructure/kubernetes/network-policies/

# Setup WAF rules (if using AWS ALB)
kubectl apply -f infrastructure/kubernetes/ingress/waf-rules.yaml
```

## 🐳 Phase 4: Application Deployment

### Step 1: Build and Push Images

```bash
# Login to container registry
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin

# Build backend image
cd apps/backend
docker build -f Dockerfile.prod -t ghcr.io/your-org/raisket-backend:v1.0.0 .
docker push ghcr.io/your-org/raisket-backend:v1.0.0

# Build frontend image
cd ../frontend
docker build -f Dockerfile.prod -t ghcr.io/your-org/raisket-frontend:v1.0.0 .
docker push ghcr.io/your-org/raisket-frontend:v1.0.0
```

### Step 2: Deploy Applications

```bash
# Apply namespace
kubectl apply -f infrastructure/kubernetes/namespaces/production.yaml

# Deploy backend
envsubst < infrastructure/kubernetes/deployments/backend.yaml | kubectl apply -f -

# Deploy frontend
envsubst < infrastructure/kubernetes/deployments/frontend.yaml | kubectl apply -f -

# Deploy services
kubectl apply -f infrastructure/kubernetes/services/

# Deploy ingress
kubectl apply -f infrastructure/kubernetes/ingress/production/
```

### Step 3: Verify Deployment

```bash
# Check pod status
kubectl get pods -n raisket-production

# Check services
kubectl get services -n raisket-production

# Check ingress
kubectl get ingress -n raisket-production

# Test health endpoints
curl -f https://api.raisket.mx/health
curl -f https://app.raisket.mx/health
```

## 📊 Phase 5: Monitoring Setup

### Step 1: Deploy Monitoring Stack

```bash
# Deploy Prometheus
kubectl apply -f infrastructure/kubernetes/monitoring/prometheus/

# Deploy Grafana
kubectl apply -f infrastructure/kubernetes/monitoring/grafana/

# Deploy Jaeger for tracing
kubectl apply -f infrastructure/kubernetes/monitoring/jaeger/
```

### Step 2: Configure Datadog

```bash
# Deploy Datadog agent
kubectl apply -f infrastructure/kubernetes/monitoring/datadog/

# Verify Datadog is receiving data
kubectl logs -f daemonset/datadog-agent -n datadog
```

### Step 3: Setup Alerting

```bash
# Configure alert rules
kubectl apply -f infrastructure/kubernetes/monitoring/alerting/

# Test alert channels
kubectl apply -f infrastructure/kubernetes/monitoring/test-alerts.yaml
```

## 🔄 Phase 6: CI/CD Setup

### Step 1: Configure GitHub Actions

```bash
# Set up repository secrets in GitHub:
# - AWS_ACCESS_KEY_ID_PROD
# - AWS_SECRET_ACCESS_KEY_PROD
# - GITHUB_TOKEN
# - SLACK_WEBHOOK_URL
# - DATADOG_API_KEY
# - CLAUDE_API_KEY
# - BURO_CLIENT_ID
# - BURO_CLIENT_SECRET
```

### Step 2: Test CI/CD Pipeline

```bash
# Create a test branch
git checkout -b test-deployment

# Make a small change
echo "# Test deployment" >> README.md
git add README.md
git commit -m "Test: trigger CI/CD pipeline"
git push origin test-deployment

# Create pull request and verify CI runs
# Merge to develop to test staging deployment
# Merge to main to test production deployment
```

## 📋 Phase 7: Compliance & Security Validation

### Step 1: Security Scan

```bash
# Run container security scan
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image ghcr.io/your-org/raisket-backend:v1.0.0

# Run OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://app.raisket.mx
```

### Step 2: Compliance Check

```bash
# Run database compliance check
psql -h $DB_ENDPOINT -U raisket_user -d raisket_production \
  -f compliance/scripts/cnbv-compliance-check.sql

# Verify audit logging
kubectl logs -f deployment/raisket-backend -n raisket-production | grep "AUDIT"
```

### Step 3: Performance Testing

```bash
# Run load tests
cd tests/load
npm install
API_URL=https://api.raisket.mx npm run test:production
```

## 🎯 Phase 8: Go-Live Checklist

### Pre-Launch Verification
- [ ] All health checks passing
- [ ] SSL certificates valid and auto-renewing
- [ ] Database backups running successfully
- [ ] Monitoring and alerting configured
- [ ] CI/CD pipeline tested
- [ ] Security scans passed
- [ ] Performance tests passed
- [ ] Compliance requirements met

### DNS Configuration
```bash
# Update DNS records to point to production
# A record: app.raisket.mx -> ALB DNS name
# A record: api.raisket.mx -> ALB DNS name
# CNAME: www.raisket.mx -> app.raisket.mx
```

### Final Testing
```bash
# Test complete user journey
cd tests/e2e
PRODUCTION_URL=https://app.raisket.mx npm run test:production

# Test critical API endpoints
cd tests/api
PRODUCTION_API_URL=https://api.raisket.mx npm run test:critical
```

## 🚨 Phase 9: Incident Response Setup

### Step 1: Create Runbooks

```bash
# Create incident response procedures
cp docs/runbooks/template.md docs/runbooks/database-failure.md
cp docs/runbooks/template.md docs/runbooks/application-error.md
cp docs/runbooks/template.md docs/runbooks/security-incident.md
```

### Step 2: Setup On-Call Rotation

```bash
# Configure PagerDuty or similar service
# Set up escalation policies
# Test alert delivery
```

## 📈 Phase 10: Post-Launch Monitoring

### Week 1 Monitoring Tasks
- [ ] Monitor error rates and response times
- [ ] Check database performance and connection counts
- [ ] Verify backup jobs are running
- [ ] Monitor SSL certificate expiration
- [ ] Check compliance audit logs
- [ ] Review security scan results

### Monthly Tasks
- [ ] Review and rotate secrets
- [ ] Update dependencies and security patches
- [ ] Performance optimization review
- [ ] Compliance audit report
- [ ] Disaster recovery testing

## 🆘 Troubleshooting Guide

### Common Issues

#### Pod Not Starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n raisket-production

# Check logs
kubectl logs <pod-name> -n raisket-production

# Check resource limits
kubectl top pods -n raisket-production
```

#### Database Connection Issues
```bash
# Test database connectivity
kubectl run db-test --image=postgres:15-alpine --rm -it --restart=Never -n raisket-production -- \
  psql -h $DB_ENDPOINT -U raisket_user -d raisket_production -c "SELECT 1;"

# Check database resource usage
aws rds describe-db-instances --db-instance-identifier raisket-production
```

#### SSL Certificate Issues
```bash
# Check certificate status
kubectl describe certificate raisket-tls -n raisket-production

# Force certificate renewal
kubectl delete certificate raisket-tls -n raisket-production
kubectl apply -f infrastructure/kubernetes/certificates/
```

### Emergency Procedures

#### Rollback Deployment
```bash
# Rollback to previous version
kubectl rollout undo deployment/raisket-backend -n raisket-production
kubectl rollout undo deployment/raisket-frontend -n raisket-production

# Verify rollback
kubectl rollout status deployment/raisket-backend -n raisket-production
```

#### Scale Up Resources
```bash
# Scale up pods
kubectl scale deployment raisket-backend --replicas=6 -n raisket-production

# Scale up database (if needed)
aws rds modify-db-instance --db-instance-identifier raisket-production \
  --db-instance-class db.r5.2xlarge --apply-immediately
```

## 📞 Support Contacts

### Emergency Contacts
- **DevOps Lead**: +52 55 1234 5678
- **Security Team**: security@raisket.mx
- **Database Admin**: dba@raisket.mx
- **Compliance Officer**: compliance@raisket.mx

### Vendor Support
- **AWS Support**: Enterprise tier
- **Datadog Support**: Pro tier
- **Buró de Crédito**: Technical support contact
- **Claude API**: Anthropic support

## 🎉 Success Criteria

Your deployment is successful when:

✅ **Availability**: 99.9% uptime SLA met
✅ **Performance**: API responses < 200ms average
✅ **Security**: All security scans pass
✅ **Compliance**: CNBV/Condusef requirements met
✅ **Monitoring**: All alerts and dashboards functional
✅ **Backup**: Daily backups running successfully
✅ **CI/CD**: Automated deployments working
✅ **User Experience**: Complete user journeys working

---

## 📚 Additional Resources

- [Architecture Documentation](docs/architecture/)
- [API Documentation](docs/api/)
- [Security Policies](docs/security/)
- [Compliance Requirements](docs/compliance/)
- [Monitoring Runbooks](docs/runbooks/)

**Congratulations! Your Raisket Mexican Fintech Platform is now live in production! 🚀🇲🇽**