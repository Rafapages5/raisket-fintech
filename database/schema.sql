-- Raisket Mexican Fintech Platform - PostgreSQL Schema
-- Designed for CNBV/Condusef compliance and enterprise security

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

-- ==========================================
-- CORE SCHEMA - User Management & Authentication
-- ==========================================

-- Users table with Mexican KYC requirements
CREATE TABLE core.users (
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
    curp VARCHAR(18) UNIQUE, -- Clave Única de Registro de Población
    rfc VARCHAR(13), -- Registro Federal de Contribuyentes
    ine_number VARCHAR(20), -- INE voter ID
    
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
    kyc_level INTEGER DEFAULT 1 CHECK (kyc_level IN (1, 2, 3, 4)), -- CNBV KYC levels
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
CREATE TABLE core.user_sessions (
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
CREATE TABLE core.kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'ine', 'curp', 'proof_of_address', 'income_proof'
    document_number VARCHAR(100),
    file_path VARCHAR(500), -- Encrypted file storage path
    file_hash VARCHAR(64), -- SHA-256 hash for integrity
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
CREATE TABLE financial.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    brand_name VARCHAR(200),
    institution_type VARCHAR(50) NOT NULL, -- 'bank', 'fintech', 'credit_union', 'insurance'
    
    -- Mexican Regulatory Information
    cnbv_license VARCHAR(50),
    condusef_registration VARCHAR(50),
    cnsf_registration VARCHAR(50), -- For insurance companies
    
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
    risk_rating VARCHAR(10), -- AAA, AA, A, BBB, etc.
    
    -- Integration Status
    api_enabled BOOLEAN DEFAULT FALSE,
    api_endpoint VARCHAR(255),
    webhook_endpoint VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Products (Enhanced Mexican market)
CREATE TABLE financial.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES financial.institutions(id),
    
    -- Product Information
    name VARCHAR(200) NOT NULL,
    product_code VARCHAR(50),
    category VARCHAR(50) NOT NULL, -- 'credit_card', 'personal_loan', 'mortgage', 'auto_loan', 'investment', 'insurance'
    subcategory VARCHAR(50),
    description TEXT,
    terms_and_conditions TEXT,
    
    -- Financial Terms
    min_amount DECIMAL(15,2),
    max_amount DECIMAL(15,2),
    interest_rate_min DECIMAL(5,4),
    interest_rate_max DECIMAL(5,4),
    rate_type VARCHAR(20), -- 'fixed', 'variable'
    
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
    accepts_imss BOOLEAN DEFAULT TRUE, -- Instituto Mexicano del Seguro Social
    accepts_issste BOOLEAN DEFAULT TRUE, -- Instituto de Seguridad y Servicios Sociales de los Trabajadores del Estado
    requires_guarantor BOOLEAN DEFAULT FALSE,
    
    -- Product Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    commission_rate DECIMAL(5,4), -- Our commission percentage
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit Scores from Buró de Crédito
CREATE TABLE financial.credit_scores (
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
    risk_category VARCHAR(20), -- 'low', 'medium', 'high'
    recommendation_score INTEGER CHECK (recommendation_score >= 0 AND recommendation_score <= 100),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_current BOOLEAN DEFAULT TRUE
);

-- User Applications
CREATE TABLE financial.applications (
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
CREATE TABLE compliance.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Event Information
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NOT NULL, -- 'authentication', 'data_access', 'financial_transaction', 'kyc'
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
CREATE TABLE compliance.cnbv_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(50) NOT NULL,
    reporting_period DATE NOT NULL,
    report_data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Condusef Complaints
CREATE TABLE compliance.condusef_complaints (
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
CREATE TABLE analytics.user_events (
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
CREATE TABLE analytics.product_metrics (
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

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Core Users Indexes
CREATE INDEX idx_users_email ON core.users(email);
CREATE INDEX idx_users_curp ON core.users(curp);
CREATE INDEX idx_users_rfc ON core.users(rfc);
CREATE INDEX idx_users_kyc_status ON core.users(kyc_status);
CREATE INDEX idx_users_created_at ON core.users(created_at);

-- Financial Products Indexes
CREATE INDEX idx_products_category ON financial.products(category);
CREATE INDEX idx_products_institution ON financial.products(institution_id);
CREATE INDEX idx_products_active ON financial.products(is_active);
CREATE INDEX idx_products_featured ON financial.products(is_featured);

-- Credit Scores Indexes
CREATE INDEX idx_credit_scores_user ON financial.credit_scores(user_id);
CREATE INDEX idx_credit_scores_current ON financial.credit_scores(is_current);
CREATE INDEX idx_credit_scores_buro_score ON financial.credit_scores(buro_score);

-- Applications Indexes
CREATE INDEX idx_applications_user ON financial.applications(user_id);
CREATE INDEX idx_applications_product ON financial.applications(product_id);
CREATE INDEX idx_applications_status ON financial.applications(status);
CREATE INDEX idx_applications_created ON financial.applications(created_at);

-- Audit Log Indexes
CREATE INDEX idx_audit_log_user ON compliance.audit_log(user_id);
CREATE INDEX idx_audit_log_event_type ON compliance.audit_log(event_type);
CREATE INDEX idx_audit_log_created ON compliance.audit_log(created_at);
CREATE INDEX idx_audit_log_resource ON compliance.audit_log(resource_type, resource_id);

-- Analytics Indexes
CREATE INDEX idx_user_events_user ON analytics.user_events(user_id);
CREATE INDEX idx_user_events_created ON analytics.user_events(created_at);
CREATE INDEX idx_product_metrics_product ON analytics.product_metrics(product_id);
CREATE INDEX idx_product_metrics_date ON analytics.product_metrics(metric_date);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on sensitive tables
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies will be defined based on user roles and permissions
-- Example: Users can only access their own data
-- CREATE POLICY user_isolation ON core.users FOR ALL TO authenticated_user USING (id = current_user_id());

-- ==========================================
-- TRIGGERS FOR AUDIT AND COMPLIANCE
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON core.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON financial.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON financial.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO compliance.audit_log (
        event_type,
        event_category,
        event_description,
        user_id,
        resource_type,
        resource_id,
        request_data
    ) VALUES (
        TG_OP,
        'data_modification',
        'Table: ' || TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
        COALESCE(NEW.user_id, OLD.user_id),
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE 
            WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
            ELSE row_to_json(NEW)
        END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON core.users FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_credit_scores AFTER INSERT OR UPDATE OR DELETE ON financial.credit_scores FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_applications AFTER INSERT OR UPDATE OR DELETE ON financial.applications FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ==========================================
-- SAMPLE DATA FOR TESTING
-- ==========================================

-- Insert sample Mexican financial institution
INSERT INTO financial.institutions (name, brand_name, institution_type, cnbv_license, is_active, api_enabled) 
VALUES 
    ('Banco Nacional de México', 'Banamex', 'bank', 'CNBV-001', true, true),
    ('Banco Bilbao Vizcaya Argentaria México', 'BBVA México', 'bank', 'CNBV-002', true, true),
    ('Banco Santander México', 'Santander', 'bank', 'CNBV-003', true, true),
    ('Konfío', 'Konfío', 'fintech', 'CNBV-FINTECH-001', true, true);

-- Insert sample products
INSERT INTO financial.products (
    institution_id, name, category, subcategory, description,
    min_amount, max_amount, interest_rate_min, interest_rate_max,
    min_income, min_credit_score, annual_fee, is_active, commission_rate
) VALUES 
    (
        (SELECT id FROM financial.institutions WHERE name = 'Banco Nacional de México'),
        'Tarjeta de Crédito Banamex Oro',
        'credit_card',
        'rewards',
        'Tarjeta de crédito con programa de recompensas y beneficios exclusivos',
        5000.00,
        200000.00,
        0.25,
        0.45,
        15000.00,
        650,
        0.00,
        true,
        0.05
    ),
    (
        (SELECT id FROM financial.institutions WHERE name = 'Konfío'),
        'Crédito Empresarial Konfío',
        'business_loan',
        'working_capital',
        'Crédito empresarial para capital de trabajo',
        50000.00,
        3000000.00,
        0.18,
        0.35,
        100000.00,
        600,
        0.00,
        true,
        0.08
    );

COMMENT ON SCHEMA core IS 'Core user management and authentication data';
COMMENT ON SCHEMA financial IS 'Financial products, institutions, and credit data';
COMMENT ON SCHEMA compliance IS 'Regulatory compliance and audit data';
COMMENT ON SCHEMA analytics IS 'Business intelligence and analytics data';

COMMENT ON TABLE core.users IS 'User profiles with Mexican KYC requirements and CNBV compliance';
COMMENT ON TABLE financial.credit_scores IS 'Credit scores from Buró de Crédito with risk assessment';
COMMENT ON TABLE financial.applications IS 'Financial product applications with commission tracking';
COMMENT ON TABLE compliance.audit_log IS 'Immutable audit trail for regulatory compliance';