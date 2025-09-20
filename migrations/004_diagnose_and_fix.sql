-- Migration: Diagnose existing schema and fix
-- Description: Check what columns exist and add missing ones safely
-- Date: 2025-09-13

-- First, let's see what columns exist in the products table
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'products'
ORDER BY ordinal_position;

-- Let's also check what tables exist in public schema
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;