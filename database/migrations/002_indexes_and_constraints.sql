-- Migration 002: Indexes and Constraints
-- Raisket Mexican Fintech Platform
-- Created: 2024-01-01
-- Description: Adds performance indexes and data constraints

-- Migration metadata
INSERT INTO public.schema_migrations (version, name, applied_at) 
VALUES (2, 'indexes_and_constraints', NOW())
ON CONFLICT (version) DO NOTHING;

-- ==========================================
-- CORE SCHEMA INDEXES
-- ==========================================

-- Users table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON core.users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_curp ON core.users(curp);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_rfc ON core.users(rfc);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_phone ON core.users(phone);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_kyc_status ON core.users(kyc_status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_status ON core.users(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON core.users(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_login ON core.users(last_login_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_kyc_expires ON core.users(kyc_expires_at);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_status_kyc ON core.users(status, kyc_status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_location ON core.users(state, city);

-- User sessions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_user_id ON core.user_sessions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_token ON core.user_sessions(session_token);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_expires ON core.user_sessions(expires_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_active ON core.user_sessions(is_active, expires_at);

-- KYC documents indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_kyc_docs_user_id ON core.kyc_documents(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_kyc_docs_type ON core.kyc_documents(document_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_kyc_docs_status ON core.kyc_documents(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_kyc_docs_created ON core.kyc_documents(created_at);

-- ==========================================
-- FINANCIAL SCHEMA INDEXES
-- ==========================================

-- Institutions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_institutions_type ON financial.institutions(institution_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_institutions_active ON financial.institutions(is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_institutions_cnbv ON financial.institutions(cnbv_license);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_institutions_location ON financial.institutions(state, city);

-- Products indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category ON financial.products(category);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_subcategory ON financial.products(subcategory);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_institution ON financial.products(institution_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_active ON financial.products(is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_featured ON financial.products(is_featured);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_created ON financial.products(created_at);

-- Composite indexes for product search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_active ON financial.products(category, is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search ON financial.products(category, is_active, min_income, min_credit_score);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_commission ON financial.products(commission_rate, is_active);

-- Text search index for products
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_name_search ON financial.products USING gin(to_tsvector('spanish', name));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_description_search ON financial.products USING gin(to_tsvector('spanish', description));

-- Credit scores indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_credit_scores_user ON financial.credit_scores(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_credit_scores_current ON financial.credit_scores(is_current);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_credit_scores_score ON financial.credit_scores(buro_score);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_credit_scores_created ON financial.credit_scores(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_credit_scores_expires ON financial.credit_scores(expires_at);

-- Composite index for active credit scores
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_credit_scores_active ON financial.credit_scores(user_id, is_current, expires_at);

-- Applications indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_user ON financial.applications(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_product ON financial.applications(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_status ON financial.applications(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_number ON financial.applications(application_number);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_created ON financial.applications(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_submitted ON financial.applications(submitted_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_decision ON financial.applications(decision_date);

-- Composite indexes for application queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_user_status ON financial.applications(user_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_product_status ON financial.applications(product_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_commission ON financial.applications(commission_paid, commission_amount);

-- ==========================================
-- COMPLIANCE SCHEMA INDEXES
-- ==========================================

-- Audit log indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_user ON compliance.audit_log(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_event_type ON compliance.audit_log(event_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_category ON compliance.audit_log(event_category);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_created ON compliance.audit_log(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_resource ON compliance.audit_log(resource_type, resource_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_request ON compliance.audit_log(request_id);

-- Composite indexes for audit queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_user_date ON compliance.audit_log(user_id, created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_type_date ON compliance.audit_log(event_type, created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_retention ON compliance.audit_log(requires_retention, retention_years);

-- CNBV reports indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cnbv_reports_type ON compliance.cnbv_reports(report_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cnbv_reports_period ON compliance.cnbv_reports(reporting_period);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cnbv_reports_status ON compliance.cnbv_reports(status);

-- Condusef complaints indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_condusef_complaints_user ON compliance.condusef_complaints(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_condusef_complaints_number ON compliance.condusef_complaints(complaint_number);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_condusef_complaints_type ON compliance.condusef_complaints(complaint_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_condusef_complaints_status ON compliance.condusef_complaints(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_condusef_complaints_created ON compliance.condusef_complaints(created_at);

-- ==========================================
-- ANALYTICS SCHEMA INDEXES
-- ==========================================

-- User events indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_events_user ON analytics.user_events(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_events_session ON analytics.user_events(session_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_events_name ON analytics.user_events(event_name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_events_created ON analytics.user_events(created_at);

-- Composite indexes for analytics queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_events_user_date ON analytics.user_events(user_id, created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_events_name_date ON analytics.user_events(event_name, created_at);

-- Product metrics indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_metrics_product ON analytics.product_metrics(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_metrics_date ON analytics.product_metrics(metric_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_metrics_created ON analytics.product_metrics(created_at);

-- AI recommendations indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_recommendations_user ON analytics.ai_recommendations(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_recommendations_generated ON analytics.ai_recommendations(generated_at);

-- ==========================================
-- ADDITIONAL CONSTRAINTS
-- ==========================================

-- Email format constraint
ALTER TABLE core.users 
ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- CURP format constraint (Mexican format)
ALTER TABLE core.users 
ADD CONSTRAINT check_curp_format 
CHECK (curp IS NULL OR curp ~* '^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$');

-- RFC format constraint (Mexican format)
ALTER TABLE core.users 
ADD CONSTRAINT check_rfc_format 
CHECK (rfc IS NULL OR rfc ~* '^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{0,3}$');

-- Phone format constraint
ALTER TABLE core.users 
ADD CONSTRAINT check_phone_format 
CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$');

-- Age constraint (18+ for financial services)
ALTER TABLE core.users 
ADD CONSTRAINT check_minimum_age 
CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE - INTERVAL '18 years');

-- Income constraint
ALTER TABLE core.users 
ADD CONSTRAINT check_monthly_income 
CHECK (monthly_income IS NULL OR monthly_income >= 0);

-- Credit score constraints
ALTER TABLE financial.credit_scores 
ADD CONSTRAINT check_credit_utilization 
CHECK (credit_utilization_ratio IS NULL OR (credit_utilization_ratio >= 0 AND credit_utilization_ratio <= 1));

-- Product constraints
ALTER TABLE financial.products 
ADD CONSTRAINT check_interest_rates 
CHECK (interest_rate_min IS NULL OR interest_rate_max IS NULL OR interest_rate_min <= interest_rate_max);

ALTER TABLE financial.products 
ADD CONSTRAINT check_amounts 
CHECK (min_amount IS NULL OR max_amount IS NULL OR min_amount <= max_amount);

ALTER TABLE financial.products 
ADD CONSTRAINT check_terms 
CHECK (min_term_months IS NULL OR max_term_months IS NULL OR min_term_months <= max_term_months);

-- Application constraints
ALTER TABLE financial.applications 
ADD CONSTRAINT check_application_amounts 
CHECK (requested_amount IS NULL OR requested_amount > 0);

ALTER TABLE financial.applications 
ADD CONSTRAINT check_approved_amounts 
CHECK (approved_amount IS NULL OR approved_amount > 0);

-- ==========================================
-- PARTIAL INDEXES FOR PERFORMANCE
-- ==========================================

-- Partial indexes for active records only
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active_kyc 
ON core.users(kyc_status, kyc_level) 
WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_active_category 
ON financial.products(category, min_income, min_credit_score) 
WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_pending 
ON financial.applications(user_id, product_id, created_at) 
WHERE status IN ('draft', 'submitted', 'under_review');

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_active 
ON core.user_sessions(user_id, expires_at) 
WHERE is_active = true;

-- ==========================================
-- FUNCTIONAL INDEXES
-- ==========================================

-- Case-insensitive email search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_lower 
ON core.users(LOWER(email));

-- Normalized phone search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_phone_normalized 
ON core.users(regexp_replace(phone, '[^0-9]', '', 'g')) 
WHERE phone IS NOT NULL;

-- ==========================================
-- JSON INDEXES FOR JSONB COLUMNS
-- ==========================================

-- Audit log request data
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_request_data 
ON compliance.audit_log USING gin(request_data);

-- User event properties
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_events_properties 
ON analytics.user_events USING gin(event_properties);

-- AI recommendations data
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_recommendations_data 
ON analytics.ai_recommendations USING gin(recommendations_data);

-- CNBV report data
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cnbv_reports_data 
ON compliance.cnbv_reports USING gin(report_data);

COMMIT;