#!/bin/bash

# Raisket Mexican Fintech Platform - Production Deployment Script
# This script automates the complete deployment process

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
VERSION=${2:-latest}
DRY_RUN=${3:-false}

echo -e "${BLUE}🚀 Raisket Mexican Fintech Platform Deployment${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}Version: ${VERSION}${NC}"
echo -e "${BLUE}Dry Run: ${DRY_RUN}${NC}"
echo ""

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check required tools
    command -v kubectl >/dev/null 2>&1 || error "kubectl is required but not installed"
    command -v docker >/dev/null 2>&1 || error "docker is required but not installed"
    command -v aws >/dev/null 2>&1 || error "aws cli is required but not installed"
    command -v psql >/dev/null 2>&1 || error "psql is required but not installed"
    
    # Check AWS credentials
    aws sts get-caller-identity >/dev/null 2>&1 || error "AWS credentials not configured"
    
    # Check kubectl context
    kubectl config current-context | grep -q "$ENVIRONMENT" || error "kubectl context not set to $ENVIRONMENT"
    
    log "Prerequisites check passed ✓"
}

# Backup database before deployment
backup_database() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log "Creating database backup..."
        
        BACKUP_NAME="pre-deploy-$(date +%Y%m%d-%H%M%S)"
        
        if [ "$DRY_RUN" = "false" ]; then
            kubectl create job --from=cronjob/database-backup "$BACKUP_NAME" -n "raisket-$ENVIRONMENT"
            kubectl wait --for=condition=complete job/"$BACKUP_NAME" -n "raisket-$ENVIRONMENT" --timeout=300s
            log "Database backup completed ✓"
        else
            log "DRY RUN: Would create database backup"
        fi
    fi
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    if [ "$DRY_RUN" = "false" ]; then
        # Apply migration job
        envsubst < infrastructure/kubernetes/jobs/migration.yaml | kubectl apply -f -
        kubectl wait --for=condition=complete job/database-migration -n "raisket-$ENVIRONMENT" --timeout=300s
        log "Database migrations completed ✓"
    else
        log "DRY RUN: Would run database migrations"
    fi
}

# Deploy applications
deploy_applications() {
    log "Deploying applications..."
    
    # Set image tags
    export IMAGE_TAG="$VERSION"
    export ENVIRONMENT_NAME="$ENVIRONMENT"
    
    if [ "$DRY_RUN" = "false" ]; then
        # Deploy backend
        envsubst < infrastructure/kubernetes/deployments/"$ENVIRONMENT"/backend.yaml | kubectl apply -f -
        
        # Deploy frontend
        envsubst < infrastructure/kubernetes/deployments/"$ENVIRONMENT"/frontend.yaml | kubectl apply -f -
        
        # Deploy services
        kubectl apply -f infrastructure/kubernetes/services/"$ENVIRONMENT"/
        
        # Deploy ingress
        kubectl apply -f infrastructure/kubernetes/ingress/"$ENVIRONMENT"/
        
        log "Applications deployed ✓"
    else
        log "DRY RUN: Would deploy applications"
    fi
}

# Wait for deployment to be ready
wait_for_deployment() {
    log "Waiting for deployment to be ready..."
    
    if [ "$DRY_RUN" = "false" ]; then
        kubectl rollout status deployment/raisket-backend-"$ENVIRONMENT" -n "raisket-$ENVIRONMENT" --timeout=600s
        kubectl rollout status deployment/raisket-frontend-"$ENVIRONMENT" -n "raisket-$ENVIRONMENT" --timeout=600s
        
        # Wait additional time for services to be fully ready
        sleep 30
        
        log "Deployment ready ✓"
    else
        log "DRY RUN: Would wait for deployment"
    fi
}

# Run health checks
run_health_checks() {
    log "Running health checks..."
    
    if [ "$DRY_RUN" = "false" ]; then
        # Backend health check
        kubectl run health-check-backend --image=curlimages/curl:latest --rm -i --restart=Never -n "raisket-$ENVIRONMENT" -- \
            curl -f "http://raisket-backend-$ENVIRONMENT:8000/health" || error "Backend health check failed"
        
        # Frontend health check
        kubectl run health-check-frontend --image=curlimages/curl:latest --rm -i --restart=Never -n "raisket-$ENVIRONMENT" -- \
            curl -f "http://raisket-frontend-$ENVIRONMENT:3000/health" || error "Frontend health check failed"
        
        # Database health check
        kubectl run health-check-database --image=curlimages/curl:latest --rm -i --restart=Never -n "raisket-$ENVIRONMENT" -- \
            curl -f "http://raisket-backend-$ENVIRONMENT:8000/health/database" || error "Database health check failed"
        
        # Redis health check
        kubectl run health-check-redis --image=curlimages/curl:latest --rm -i --restart=Never -n "raisket-$ENVIRONMENT" -- \
            curl -f "http://raisket-backend-$ENVIRONMENT:8000/health/redis" || error "Redis health check failed"
        
        log "Health checks passed ✓"
    else
        log "DRY RUN: Would run health checks"
    fi
}

# Run smoke tests
run_smoke_tests() {
    log "Running smoke tests..."
    
    if [ "$DRY_RUN" = "false" ]; then
        cd tests/smoke
        npm install --silent
        
        if [ "$ENVIRONMENT" = "production" ]; then
            PRODUCTION_URL=https://app.raisket.mx npm run test:production
        else
            STAGING_URL=https://staging.raisket.mx npm run test
        fi
        
        cd ../..
        log "Smoke tests passed ✓"
    else
        log "DRY RUN: Would run smoke tests"
    fi
}

# Update deployment tracking
update_deployment_tracking() {
    log "Updating deployment tracking..."
    
    if [ "$DRY_RUN" = "false" ]; then
        # Annotate deployments with version
        kubectl annotate deployment "raisket-backend-$ENVIRONMENT" -n "raisket-$ENVIRONMENT" \
            deployment.kubernetes.io/revision="$VERSION" --overwrite
        kubectl annotate deployment "raisket-frontend-$ENVIRONMENT" -n "raisket-$ENVIRONMENT" \
            deployment.kubernetes.io/revision="$VERSION" --overwrite
        
        # Update deployment history
        kubectl patch deployment "raisket-backend-$ENVIRONMENT" -n "raisket-$ENVIRONMENT" \
            -p "{\"metadata\":{\"annotations\":{\"deployment.kubernetes.io/change-cause\":\"Deploy version $VERSION\"}}}"
        
        log "Deployment tracking updated ✓"
    else
        log "DRY RUN: Would update deployment tracking"
    fi
}

# Send notifications
send_notifications() {
    log "Sending deployment notifications..."
    
    if [ "$DRY_RUN" = "false" ]; then
        # Slack notification (if webhook URL is set)
        if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
            curl -X POST -H 'Content-type: application/json' \
                --data "{\"text\":\"🚀 Raisket $ENVIRONMENT deployment successful! Version: $VERSION\"}" \
                "$SLACK_WEBHOOK_URL" || warning "Failed to send Slack notification"
        fi
        
        # Datadog event (if API key is set)
        if [ -n "${DATADOG_API_KEY:-}" ]; then
            curl -X POST "https://api.datadoghq.com/api/v1/events" \
                -H "Content-Type: application/json" \
                -H "DD-API-KEY: $DATADOG_API_KEY" \
                -d "{
                    \"title\": \"Raisket Deployment\",
                    \"text\": \"Version $VERSION deployed to $ENVIRONMENT\",
                    \"alert_type\": \"success\",
                    \"tags\": [\"env:$ENVIRONMENT\", \"service:raisket\", \"version:$VERSION\"]
                }" || warning "Failed to send Datadog event"
        fi
        
        log "Notifications sent ✓"
    else
        log "DRY RUN: Would send notifications"
    fi
}

# Cleanup old resources
cleanup_old_resources() {
    log "Cleaning up old resources..."
    
    if [ "$DRY_RUN" = "false" ]; then
        # Clean up old ReplicaSets (keep last 3)
        kubectl delete replicaset -n "raisket-$ENVIRONMENT" \
            $(kubectl get rs -n "raisket-$ENVIRONMENT" --sort-by='.metadata.creationTimestamp' -o name | head -n -3) \
            2>/dev/null || true
        
        # Clean up completed jobs older than 7 days
        kubectl delete job -n "raisket-$ENVIRONMENT" \
            $(kubectl get job -n "raisket-$ENVIRONMENT" -o jsonpath='{.items[?(@.status.completionTime<"'$(date -d '7 days ago' -Iseconds)'")].metadata.name}') \
            2>/dev/null || true
        
        log "Cleanup completed ✓"
    else
        log "DRY RUN: Would cleanup old resources"
    fi
}

# Rollback function
rollback() {
    error_msg=$1
    error "Deployment failed: $error_msg"
    
    if [ "$ENVIRONMENT" = "production" ] && [ "$DRY_RUN" = "false" ]; then
        warning "Initiating rollback..."
        
        kubectl rollout undo deployment/"raisket-backend-$ENVIRONMENT" -n "raisket-$ENVIRONMENT"
        kubectl rollout undo deployment/"raisket-frontend-$ENVIRONMENT" -n "raisket-$ENVIRONMENT"
        
        kubectl rollout status deployment/"raisket-backend-$ENVIRONMENT" -n "raisket-$ENVIRONMENT" --timeout=300s
        kubectl rollout status deployment/"raisket-frontend-$ENVIRONMENT" -n "raisket-$ENVIRONMENT" --timeout=300s
        
        warning "Rollback completed"
        
        # Send rollback notification
        if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
            curl -X POST -H 'Content-type: application/json' \
                --data "{\"text\":\"⚠️ Raisket $ENVIRONMENT deployment failed and was rolled back! Error: $error_msg\"}" \
                "$SLACK_WEBHOOK_URL" || true
        fi
    fi
    
    exit 1
}

# Main deployment flow
main() {
    log "Starting deployment process..."
    
    # Set error handler
    trap 'rollback "Unexpected error occurred"' ERR
    
    check_prerequisites
    backup_database
    run_migrations
    deploy_applications
    wait_for_deployment
    run_health_checks
    run_smoke_tests
    update_deployment_tracking
    send_notifications
    cleanup_old_resources
    
    log "🎉 Deployment completed successfully!"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        echo ""
        echo -e "${GREEN}🚀 Raisket Mexican Fintech Platform is now live!${NC}"
        echo -e "${GREEN}Frontend: https://app.raisket.mx${NC}"
        echo -e "${GREEN}API: https://api.raisket.mx${NC}"
        echo -e "${GREEN}Version: $VERSION${NC}"
    else
        echo ""
        echo -e "${GREEN}🚀 Raisket staging environment updated!${NC}"
        echo -e "${GREEN}Frontend: https://staging.raisket.mx${NC}"
        echo -e "${GREEN}API: https://api-staging.raisket.mx${NC}"
        echo -e "${GREEN}Version: $VERSION${NC}"
    fi
}

# Validation for parameters
if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "staging" ]; then
    error "Environment must be 'production' or 'staging'"
fi

# Run main function
main "$@"