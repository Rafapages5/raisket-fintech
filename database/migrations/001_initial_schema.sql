-- Migration 001: Initial Schema Creation
-- Raisket Mexican Fintech Platform
-- Created: 2024-01-01
-- Description: Creates the foundational database schema with all core tables

-- Migration metadata
INSERT INTO public.schema_migrations (version, name, applied_at) 
VALUES (1, 'initial_schema', NOW())
ON CONFLICT (version) DO NOTHING;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create schemas for data organization
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS financial;
CREATE SCHEMA IF NOT EXISTS compliance;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Grant permissions
GRANT USAGE ON SCHEMA core TO raisket_user;
GRANT USAGE ON SCHEMA financial TO raisket_user;
GRANT USAGE ON SCHEMA compliance TO raisket_user;
GRANT USAGE ON SCHEMA analytics TO raisket_user;

-- ==========================================
-- CORE SCHEMA - User Management & Authentication
-- ==========================================

-- Users table with Mexican KYC requirements
CREATE TABLE IF NOT EXISTS core.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Information
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Authentication
    password_hash VARCHAR(255),
    password_salt VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    
    -- Profile Information (encrypted)
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10),
    nationality VARCHAR(3) DEFAULT 'MEX',
    
    -- Mexican Identification
    curp VARCHAR(18) UNIQUE,
    rfc VARCHAR(13),
    ine_number VARCHAR(20),
    
    -- Address Information
    street_address TEXT,
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(3) DEFAULT 'MEX',
    
    -- Employment Information
    employment_status VARCHAR(50),
    employer_name VARCHAR(200),
    job_title VARCHAR(100),
    monthly_income DECIMAL(15,2),
    income_source VARCHAR(100),
    
    -- KYC Status
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'in_progress', 'approved', 'rejected', 'expired')),
    kyc_level INTEGER DEFAULT 1 CHECK (kyc_level IN (1, 2, 3, 4)),
    kyc_approved_at TIMESTAMP WITH TIME ZONE,
    kyc_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Account Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'blocked', 'closed')),
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_ip_address INET,
    
    -- Compliance
    privacy_policy_accepted BOOLEAN DEFAULT FALSE,
    privacy_policy_accepted_at TIMESTAMP WITH TIME ZONE,
    terms_accepted BOOLEAN DEFAULT FALSE,
    terms_accepted_at TIMESTAMP WITH TIME ZONE,
    marketing_consent BOOLEAN DEFAULT FALSE
);

-- User sessions for security tracking
CREATE TABLE IF NOT EXISTS core.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    refresh_token VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_fingerprint VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- KYC Documents
CREATE TABLE IF NOT EXISTS core.kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100),
    file_path VARCHAR(500),
    file_hash VARCHAR(64),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES core.users(id),
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- FINANCIAL SCHEMA - Products & Credit Data
-- ==========================================

-- Financial Institutions
CREATE TABLE IF NOT EXISTS financial.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    brand_name VARCHAR(200),
    institution_type VARCHAR(50) NOT NULL,
    
    -- Mexican Regulatory Information
    cnbv_license VARCHAR(50),
    condusef_registration VARCHAR(50),
    cnsf_registration VARCHAR(50),
    
    -- Contact Information
    website VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Address
    street_address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(10),
    
    -- Operational Status
    is_active BOOLEAN DEFAULT TRUE,
    risk_rating VARCHAR(10),
    
    -- Integration Status
    api_enabled BOOLEAN DEFAULT FALSE,
    api_endpoint VARCHAR(255),
    webhook_endpoint VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Products
CREATE TABLE IF NOT EXISTS financial.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES financial.institutions(id),
    
    -- Product Information
    name VARCHAR(200) NOT NULL,
    product_code VARCHAR(50),
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    description TEXT,
    terms_and_conditions TEXT,
    
    -- Financial Terms
    min_amount DECIMAL(15,2),
    max_amount DECIMAL(15,2),
    interest_rate_min DECIMAL(5,4),
    interest_rate_max DECIMAL(5,4),
    rate_type VARCHAR(20),
    
    -- Loan Terms
    min_term_months INTEGER,
    max_term_months INTEGER,
    
    -- Credit Card Specific
    annual_fee DECIMAL(10,2),
    credit_limit_min DECIMAL(15,2),
    credit_limit_max DECIMAL(15,2),
    
    -- Requirements
    min_income DECIMAL(15,2),
    min_credit_score INTEGER,
    max_credit_score INTEGER,
    employment_requirement TEXT,
    collateral_required BOOLEAN DEFAULT FALSE,
    
    -- Mexican Specific
    accepts_imss BOOLEAN DEFAULT TRUE,
    accepts_issste BOOLEAN DEFAULT TRUE,
    requires_guarantor BOOLEAN DEFAULT FALSE,
    
    -- Product Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    commission_rate DECIMAL(5,4),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit Scores from Buró de Crédito
CREATE TABLE IF NOT EXISTS financial.credit_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    
    -- Buró de Crédito Information
    buro_score INTEGER CHECK (buro_score >= 300 AND buro_score <= 850),
    buro_report_id VARCHAR(100),
    buro_consulted_at TIMESTAMP WITH TIME ZONE,
    
    -- Credit Profile
    credit_history_length_months INTEGER,
    total_debt DECIMAL(15,2),
    available_credit DECIMAL(15,2),
    credit_utilization_ratio DECIMAL(5,4),
    
    -- Payment History
    payment_history_score INTEGER CHECK (payment_history_score >= 0 AND payment_history_score <= 100),
    late_payments_count INTEGER DEFAULT 0,
    defaults_count INTEGER DEFAULT 0,
    
    -- Account Information
    credit_cards_count INTEGER DEFAULT 0,
    loans_count INTEGER DEFAULT 0,
    mortgages_count INTEGER DEFAULT 0,
    
    -- Risk Assessment
    risk_category VARCHAR(20),
    recommendation_score INTEGER CHECK (recommendation_score >= 0 AND recommendation_score <= 100),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_current BOOLEAN DEFAULT TRUE
);

-- User Applications
CREATE TABLE IF NOT EXISTS financial.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES financial.products(id),
    
    -- Application Information
    application_number VARCHAR(50) UNIQUE NOT NULL,
    requested_amount DECIMAL(15,2),
    requested_term_months INTEGER,
    
    -- Status Tracking
    status VARCHAR(20) DEFAULT 'draft' CHECK (
        status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'withdrawn', 'expired')
    ),
    
    -- Decision Information
    approved_amount DECIMAL(15,2),
    approved_rate DECIMAL(5,4),
    approved_term_months INTEGER,
    decision_date TIMESTAMP WITH TIME ZONE,
    decision_notes TEXT,
    
    -- Commission Tracking
    commission_amount DECIMAL(10,2),
    commission_paid BOOLEAN DEFAULT FALSE,
    commission_paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- COMPLIANCE SCHEMA - Audit & Regulatory
-- ==========================================

-- Audit Log for all financial operations
CREATE TABLE IF NOT EXISTS compliance.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Event Information
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    event_description TEXT,
    
    -- User Information
    user_id UUID REFERENCES core.users(id),
    user_email VARCHAR(255),
    user_ip INET,
    user_agent TEXT,
    
    -- Resource Information
    resource_type VARCHAR(50),
    resource_id UUID,
    
    -- Request Information
    http_method VARCHAR(10),
    endpoint VARCHAR(255),
    request_data JSONB,
    response_status INTEGER,
    
    -- Compliance
    requires_retention BOOLEAN DEFAULT TRUE,
    retention_years INTEGER DEFAULT 7,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    server_id VARCHAR(50),
    request_id UUID
);

-- CNBV Reporting
CREATE TABLE IF NOT EXISTS compliance.cnbv_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(50) NOT NULL,
    reporting_period DATE NOT NULL,
    report_data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Condusef Complaints
CREATE TABLE IF NOT EXISTS compliance.condusef_complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core.users(id),
    complaint_number VARCHAR(50) UNIQUE NOT NULL,
    complaint_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    resolution TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ANALYTICS SCHEMA - Business Intelligence
-- ==========================================

-- User Analytics
CREATE TABLE IF NOT EXISTS analytics.user_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES core.users(id),
    session_id UUID,
    event_name VARCHAR(100) NOT NULL,
    event_properties JSONB,
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Performance
CREATE TABLE IF NOT EXISTS analytics.product_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES financial.products(id),
    metric_date DATE NOT NULL,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    approvals_count INTEGER DEFAULT 0,
    revenue_generated DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, metric_date)
);

-- AI Recommendations
CREATE TABLE IF NOT EXISTS analytics.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core.users(id),
    recommendations_data JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schema migrations tracking
CREATE TABLE IF NOT EXISTS public.schema_migrations (
    version INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA core TO raisket_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA financial TO raisket_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA compliance TO raisket_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA analytics TO raisket_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schema_migrations TO raisket_user;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA core TO raisket_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA financial TO raisket_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA compliance TO raisket_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA analytics TO raisket_user;

COMMIT;