/**
 * Mexican Financial Product Models
 * Comprehensive data models for Mexican financial products marketplace
 * 
 * Features:
 * - Complete Mexican financial product taxonomy
 * - CNBV regulatory compliance fields
 * - Multi-currency support (MXN primary)
 * - Regional market adaptations
 * - Commission tracking for marketplace revenue
 */

import { Pool } from 'pg';

// Base Financial Product Interface
export interface BaseFinancialProduct {
  id: string;
  institutionId: string;
  name: string;
  productCode: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  termsAndConditions: string;
  
  // Regulatory Information
  cnbvAuthorization?: string;
  conducefRegistration?: string;
  regulatoryNotes?: string;
  
  // Market Information
  targetSegment: 'INDIVIDUAL' | 'BUSINESS' | 'BOTH';
  targetAgeMin?: number;
  targetAgeMax?: number;
  targetIncomeMin?: number;
  targetIncomeMax?: number;
  
  // Operational
  isActive: boolean;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  
  // Business Model
  commissionRate: number; // Our commission percentage
  commissionType: 'PERCENTAGE' | 'FIXED' | 'TIERED';
  partnershipLevel: 'BASIC' | 'PREFERRED' | 'PREMIUM' | 'EXCLUSIVE';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

// Product Categories (Mexican Market Specific)
export type ProductCategory = 
  | 'CREDIT_CARD'           // Tarjetas de Crédito
  | 'PERSONAL_LOAN'         // Créditos Personales
  | 'AUTO_LOAN'             // Créditos Automotrices
  | 'MORTGAGE'              // Créditos Hipotecarios
  | 'BUSINESS_LOAN'         // Créditos Empresariales
  | 'MICROCREDIT'           // Microcréditos
  | 'SAVINGS_ACCOUNT'       // Cuentas de Ahorro
  | 'CHECKING_ACCOUNT'      // Cuentas de Cheques
  | 'TIME_DEPOSIT'          // Depósitos a Plazo
  | 'INVESTMENT_FUND'       // Fondos de Inversión
  | 'STOCK_BROKERAGE'       // Casa de Bolsa
  | 'LIFE_INSURANCE'        // Seguros de Vida
  | 'AUTO_INSURANCE'        // Seguros de Auto
  | 'HOME_INSURANCE'        // Seguros de Casa
  | 'HEALTH_INSURANCE'      // Seguros de Gastos Médicos
  | 'REMITTANCES'           // Remesas
  | 'PAYMENT_SERVICES'      // Servicios de Pago
  | 'FOREIGN_EXCHANGE'      // Divisas
  | 'AFORE'                 // Administradoras de Fondos para el Retiro
  | 'SOFOM'                 // Sociedad Financiera de Objeto Múltiple
  | 'FINTECH_LENDING';      // Préstamos Fintech

// Credit Card Specific Model
export interface CreditCardProduct extends BaseFinancialProduct {
  category: 'CREDIT_CARD';
  
  // Credit Limits
  creditLimitMin: number;
  creditLimitMax: number;
  creditLimitCurrency: 'MXN' | 'USD';
  
  // Interest Rates
  purchaseAPR: number;
  cashAdvanceAPR: number;
  balanceTransferAPR: number;
  promotionalAPR?: number;
  promotionalPeriodMonths?: number;
  
  // Fees (Mexican market specific)
  annualFee: number;
  latePaymentFee: number;
  overLimitFee: number;
  cashAdvanceFee: number;
  foreignTransactionFee: number;
  replacementCardFee: number;
  
  // Benefits and Rewards
  rewardsProgram?: {
    type: 'CASHBACK' | 'POINTS' | 'MILES' | 'NONE';
    earningRate: number;
    redemptionMinimum: number;
    specialCategories: Array<{
      category: string;
      multiplier: number;
    }>;
  };
  
  // Mexican Specific Benefits
  benefits: {
    airportLounge: boolean;
    travelInsurance: boolean;
    purchaseProtection: boolean;
    extendedWarranty: boolean;
    roadAssistance: boolean;
    medicalAssistance: boolean;
    conciergeService: boolean;
    gasStationDiscounts: boolean;
    restaurantDiscounts: boolean;
    cinemaDiscounts: boolean;
  };
  
  // Acceptance Network
  paymentNetwork: 'VISA' | 'MASTERCARD' | 'AMERICAN_EXPRESS' | 'CARNET';
  domesticAcceptance: boolean;
  internationalAcceptance: boolean;
  
  // Eligibility Criteria
  eligibility: {
    minAge: number;
    maxAge: number;
    minIncome: number;
    minCreditScore: number;
    employmentRequired: boolean;
    proofOfIncomeRequired: boolean;
    bankingRelationshipRequired: boolean;
    residencyRequirement: 'MEXICAN_CITIZEN' | 'PERMANENT_RESIDENT' | 'TEMPORARY_RESIDENT';
  };
}

// Personal Loan Model
export interface PersonalLoanProduct extends BaseFinancialProduct {
  category: 'PERSONAL_LOAN';
  
  // Loan Terms
  minLoanAmount: number;
  maxLoanAmount: number;
  currency: 'MXN' | 'USD';
  
  // Interest Rates
  interestRateMin: number;
  interestRateMax: number;
  rateType: 'FIXED' | 'VARIABLE';
  baseRate?: 'TIIE' | 'CETES' | 'PRIME'; // Mexican reference rates
  
  // Term Structure
  minTermMonths: number;
  maxTermMonths: number;
  paymentFrequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY';
  
  // Fees
  originationFee: number;
  originationFeeType: 'PERCENTAGE' | 'FIXED';
  prepaymentPenalty: number;
  latePaymentFee: number;
  administrativeFee: number;
  
  // Loan Purpose
  allowedPurposes: Array<
    | 'DEBT_CONSOLIDATION'
    | 'HOME_IMPROVEMENT'
    | 'EDUCATION'
    | 'MEDICAL_EXPENSES'
    | 'VACATION'
    | 'WEDDING'
    | 'BUSINESS_INVESTMENT'
    | 'OTHER'
  >;
  
  // Collateral Requirements
  collateralRequired: boolean;
  collateralTypes?: Array<'VEHICLE' | 'REAL_ESTATE' | 'INVESTMENT' | 'GUARANTOR'>;
  
  // Eligibility
  eligibility: {
    minAge: number;
    maxAge: number;
    minIncome: number;
    maxDebtToIncomeRatio: number;
    minCreditScore: number;
    employmentStabilityMonths: number;
    bankStatementMonths: number;
    proofOfIncomeRequired: boolean;
  };
}

// Mortgage Product Model
export interface MortgageProduct extends BaseFinancialProduct {
  category: 'MORTGAGE';
  
  // Loan Terms
  minLoanAmount: number;
  maxLoanAmount: number;
  currency: 'MXN' | 'USD' | 'UDI'; // UDI = Unidades de Inversión (inflation-adjusted)
  
  // Interest Rates
  interestRateMin: number;
  interestRateMax: number;
  rateType: 'FIXED' | 'VARIABLE' | 'MIXED';
  fixedRatePeriodYears?: number; // For mixed rate mortgages
  
  // LTV and Down Payment
  maxLoanToValueRatio: number;
  minDownPaymentPercentage: number;
  
  // Term Structure
  minTermYears: number;
  maxTermYears: number;
  
  // Mexican Government Programs
  infonavitCompatible: boolean; // Instituto del Fondo Nacional de la Vivienda para los Trabajadores
  fovisssteCompatible: boolean; // Fondo de la Vivienda del ISSSTE
  subsidyEligible: boolean;
  
  // Property Types
  allowedPropertyTypes: Array<
    | 'NEW_HOME'
    | 'USED_HOME'
    | 'CONDOMINIUM'
    | 'TOWNHOUSE'
    | 'LAND_WITH_CONSTRUCTION'
    | 'COMMERCIAL_PROPERTY'
    | 'VACATION_HOME'
  >;
  
  // Geographic Restrictions
  allowedStates: string[]; // Mexican states where available
  allowedMunicipalities: string[];
  maxPropertyValue: number;
  
  // Fees
  originationFee: number;
  appraisalFee: number;
  titleInsuranceFee: number;
  notaryFees: number;
  registrationFees: number;
  
  // Insurance Requirements
  lifeInsuranceRequired: boolean;
  propertyInsuranceRequired: boolean;
  unemploymentInsuranceAvailable: boolean;
}

// Investment Fund Model
export interface InvestmentFundProduct extends BaseFinancialProduct {
  category: 'INVESTMENT_FUND';
  
  // Fund Information
  fundType: 'EQUITY' | 'FIXED_INCOME' | 'MIXED' | 'MONEY_MARKET' | 'REAL_ESTATE' | 'COMMODITY';
  investmentStrategy: string;
  fundManager: string;
  
  // Investment Terms
  minInitialInvestment: number;
  minAdditionalInvestment: number;
  maxInvestmentAmount?: number;
  currency: 'MXN' | 'USD' | 'EUR';
  
  // Fees
  managementFee: number; // Annual percentage
  performanceFee?: number;
  entryFee?: number;
  exitFee?: number;
  switchingFee?: number;
  
  // Performance
  benchmarkIndex?: string;
  trackRecord: {
    oneYearReturn?: number;
    threeYearReturn?: number;
    fiveYearReturn?: number;
    inceptionReturn?: number;
    volatility?: number;
    sharpeRatio?: number;
  };
  
  // Risk Profile
  riskLevel: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' | 'VERY_AGGRESSIVE';
  cnbvRiskRating: string;
  
  // Tax Information
  taxOptimized: boolean;
  cuentaAfore: boolean; // AFORE account compatible
  
  // Liquidity
  redemptionNotice: number; // Days notice required
  redemptionFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  lockupPeriod?: number; // Months
}

// AFORE (Retirement Fund) Model
export interface AFOREProduct extends BaseFinancialProduct {
  category: 'AFORE';
  
  // AFORE Specific Information
  aforeName: string;
  conssarRegistration: string; // CONSAR registration number
  
  // Fees (CONSAR regulated)
  managementFee: number; // Over managed assets
  performanceFee: number; // Over returns
  totalFeeLimit: number; // CONSAR mandated maximum
  
  // Investment Funds (SIEFOREs)
  sieforeBasica: {
    equityPercentage: number;
    fixedIncomePercentage: number;
    expectedReturn: number;
    volatility: number;
  };
  
  // Performance Metrics
  performance: {
    netReturn12Months: number;
    netReturn36Months: number;
    netReturn60Months: number;
    indicator: number; // CONSAR performance indicator
    ranking: number; // Among all AFOREs
  };
  
  // Services
  services: {
    onlinePortal: boolean;
    mobileApp: boolean;
    branchOffices: number;
    callCenter: boolean;
    retirementCalculator: boolean;
    financialAdvisory: boolean;
  };
  
  // Beneficiary Services
  beneficiaryServices: {
    lifeInsurance: boolean;
    disabilityInsurance: boolean;
    survivorPension: boolean;
    unemploymentWithdrawal: boolean;
    marriageWithdrawal: boolean;
    housingWithdrawal: boolean;
  };
}

// Insurance Product Model
export interface InsuranceProduct extends BaseFinancialProduct {
  category: 'LIFE_INSURANCE' | 'AUTO_INSURANCE' | 'HOME_INSURANCE' | 'HEALTH_INSURANCE';
  
  // Coverage Information
  coverageType: string;
  minCoverageAmount: number;
  maxCoverageAmount: number;
  currency: 'MXN' | 'USD';
  
  // Premium Structure
  premiumCalculationMethod: 'FIXED' | 'PERCENTAGE_OF_COVERAGE' | 'RISK_BASED';
  paymentFrequency: 'ANNUAL' | 'SEMI_ANNUAL' | 'QUARTERLY' | 'MONTHLY';
  premiumRange: {
    min: number;
    max: number;
  };
  
  // Policy Terms
  minPolicyTerm: number; // Years
  maxPolicyTerm: number;
  renewalOptions: string[];
  
  // Mexican Regulatory
  cnsfAuthorization: string; // Comisión Nacional de Seguros y Fianzas
  reserveRequirements: string;
  
  // Coverage Details
  coverageDetails: {
    deductible?: number;
    coinsurance?: number;
    waitingPeriod?: number; // Days
    preExistingConditionsDelay?: number; // Months
    coverageExtensions?: string[];
    exclusions: string[];
  };
  
  // Beneficiary Information
  beneficiaryOptions: {
    primaryBeneficiaries: number;
    contingentBeneficiaries: number;
    irrevocableBeneficiary: boolean;
    trusteeOptions: boolean;
  };
}

// Database Model Class
export class FinancialProductModel {
  private db: Pool;
  
  constructor(database: Pool) {
    this.db = database;
  }
  
  /**
   * Create a new financial product
   */
  async createProduct(product: BaseFinancialProduct): Promise<string> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO financial.products (
          id, institution_id, name, product_code, category, subcategory,
          description, terms_and_conditions, target_segment, is_active,
          commission_rate, commission_type, partnership_level,
          created_by, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
        RETURNING id
      `;
      
      const result = await client.query(query, [
        product.id,
        product.institutionId,
        product.name,
        product.productCode,
        product.category,
        product.subcategory,
        product.description,
        product.termsAndConditions,
        product.targetSegment,
        product.isActive,
        product.commissionRate,
        product.commissionType,
        product.partnershipLevel,
        product.createdBy,
      ]);
      
      await client.query('COMMIT');
      return result.rows[0].id;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Get products by category with Mexican market filters
   */
  async getProductsByCategory(
    category: ProductCategory,
    filters: {
      minIncome?: number;
      maxIncome?: number;
      creditScore?: number;
      state?: string;
      sortBy?: 'INTEREST_RATE' | 'COMMISSION' | 'POPULARITY' | 'NEWEST';
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<BaseFinancialProduct[]> {
    let query = `
      SELECT p.*, i.name as institution_name, i.institution_type
      FROM financial.products p
      JOIN financial.institutions i ON p.institution_id = i.id
      WHERE p.category = $1 AND p.is_active = true AND i.is_active = true
    `;
    
    const params: any[] = [category];
    let paramIndex = 2;
    
    // Add filters
    if (filters.minIncome) {
      query += ` AND p.min_income <= $${paramIndex}`;
      params.push(filters.minIncome);
      paramIndex++;
    }
    
    if (filters.creditScore) {
      query += ` AND p.min_credit_score <= $${paramIndex}`;
      params.push(filters.creditScore);
      paramIndex++;
    }
    
    // Add sorting
    switch (filters.sortBy) {
      case 'INTEREST_RATE':
        query += ` ORDER BY p.interest_rate_min ASC`;
        break;
      case 'COMMISSION':
        query += ` ORDER BY p.commission_rate DESC`;
        break;
      case 'NEWEST':
        query += ` ORDER BY p.created_at DESC`;
        break;
      default:
        query += ` ORDER BY p.is_featured DESC, p.created_at DESC`;
    }
    
    // Add pagination
    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }
    
    if (filters.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }
    
    const result = await this.db.query(query, params);
    return result.rows;
  }
  
  /**
   * Get personalized product recommendations
   */
  async getPersonalizedRecommendations(
    userId: string,
    userProfile: {
      income: number;
      creditScore: number;
      age: number;
      state: string;
      goals: string[];
    }
  ): Promise<BaseFinancialProduct[]> {
    // This would integrate with the AI recommendation system
    const query = `
      SELECT p.*, i.name as institution_name,
        CASE 
          WHEN p.min_income <= $1 AND p.min_credit_score <= $2 THEN 100
          WHEN p.min_income <= $1 * 1.2 AND p.min_credit_score <= $2 + 50 THEN 80
          ELSE 60
        END as recommendation_score
      FROM financial.products p
      JOIN financial.institutions i ON p.institution_id = i.id
      WHERE p.is_active = true 
        AND i.is_active = true
        AND p.min_income <= $1 * 1.5
        AND p.min_credit_score <= $2 + 100
      ORDER BY recommendation_score DESC, p.commission_rate DESC
      LIMIT 10
    `;
    
    const result = await this.db.query(query, [userProfile.income, userProfile.creditScore]);
    return result.rows;
  }
  
  /**
   * Update product performance metrics
   */
  async updateProductMetrics(
    productId: string,
    metrics: {
      viewsCount?: number;
      applicationsCount?: number;
      approvalsCount?: number;
      revenueGenerated?: number;
    }
  ): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    const query = `
      INSERT INTO analytics.product_metrics (
        product_id, metric_date, views_count, applications_count,
        approvals_count, revenue_generated
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (product_id, metric_date)
      DO UPDATE SET
        views_count = analytics.product_metrics.views_count + EXCLUDED.views_count,
        applications_count = analytics.product_metrics.applications_count + EXCLUDED.applications_count,
        approvals_count = analytics.product_metrics.approvals_count + EXCLUDED.approvals_count,
        revenue_generated = analytics.product_metrics.revenue_generated + EXCLUDED.revenue_generated
    `;
    
    await this.db.query(query, [
      productId,
      today,
      metrics.viewsCount || 0,
      metrics.applicationsCount || 0,
      metrics.approvalsCount || 0,
      metrics.revenueGenerated || 0,
    ]);
  }
}

// Export all product types
export type FinancialProductType = 
  | CreditCardProduct
  | PersonalLoanProduct
  | MortgageProduct
  | InvestmentFundProduct
  | AFOREProduct
  | InsuranceProduct;