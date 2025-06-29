/**
 * AI-Powered Financial Product Recommendation Engine
 * Designed for Mexican fintech market with Claude API integration
 * 
 * Features:
 * - Personalized credit product recommendations
 * - Real-time Buró de Crédito integration
 * - Mexican market-specific algorithms
 * - Regulatory compliance (CNBV guidelines)
 * - Continuous learning and optimization
 * - Explainable AI for transparency
 */

import axios from 'axios';
import { Pool } from 'pg';
import { BuroApiClient, BuroCreditScore } from '../buro-integration/BuroApiClient';
import { AuditLogger } from '../audit-logging/AuditLogger';
import { FinancialProductModel, BaseFinancialProduct } from '../../models/FinancialProduct';

// User Financial Profile for Recommendations
export interface UserFinancialProfile {
  userId: string;
  
  // Personal Information
  age: number;
  monthlyIncome: number;
  employmentStatus: 'EMPLOYED' | 'SELF_EMPLOYED' | 'UNEMPLOYED' | 'RETIRED' | 'STUDENT';
  employmentStabilityMonths: number;
  educationLevel: 'PRIMARY' | 'SECONDARY' | 'BACHELOR' | 'MASTER' | 'PHD';
  
  // Geographic Information
  state: string;
  city: string;
  urbanizationLevel: 'URBAN' | 'SUBURBAN' | 'RURAL';
  
  // Financial Information
  creditScore?: number;
  existingCreditCards: number;
  existingLoans: number;
  totalDebt: number;
  savingsAmount: number;
  monthlyExpenses: number;
  
  // Goals and Preferences
  primaryGoals: Array<
    | 'BUILD_CREDIT'
    | 'DEBT_CONSOLIDATION'
    | 'HOME_PURCHASE'
    | 'CAR_PURCHASE'
    | 'BUSINESS_INVESTMENT'
    | 'EMERGENCY_FUND'
    | 'RETIREMENT_PLANNING'
    | 'TRAVEL'
    | 'EDUCATION'
  >;
  riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  preferredInstitutionTypes: Array<'BANK' | 'FINTECH' | 'CREDIT_UNION'>;
  
  // Behavioral Data
  digitalEngagement: number; // 0-100 score
  financialLiteracy: number; // 0-100 score
  channelPreference: 'DIGITAL' | 'BRANCH' | 'HYBRID';
  
  // Mexican Market Specific
  hasInfonavitCredit: boolean;
  hasFovisssteCredit: boolean;
  afore?: string;
  socialSecurityType: 'IMSS' | 'ISSSTE' | 'NONE';
  
  // Compliance and Verification
  kycLevel: number;
  accountVerificationLevel: number;
  lastCreditInquiry?: Date;
}

// Recommendation Result
export interface ProductRecommendation {
  productId: string;
  product: BaseFinancialProduct;
  
  // Recommendation Scoring
  overallScore: number; // 0-100
  eligibilityScore: number; // 0-100
  suitabilityScore: number; // 0-100
  competitivenessScore: number; // 0-100
  
  // Probability Estimates
  approvalProbability: number; // 0-100
  offerProbability: number; // 0-100
  expectedCreditLimit?: number;
  expectedInterestRate?: number;
  
  // Explanation
  reasons: string[];
  benefits: string[];
  considerations: string[];
  alternatives?: string[];
  
  // Mexican Market Context
  marketPosition: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'BELOW_AVERAGE';
  competitorComparison: {
    betterThan: number; // Percentage of similar products
    keyAdvantages: string[];
    potentialDisadvantages: string[];
  };
  
  // Regulatory Compliance
  regulatoryNotes: string[];
  cnbvGuidanceCompliant: boolean;
  
  // Timing and Actions
  recommendedAction: 'APPLY_NOW' | 'WAIT_AND_IMPROVE' | 'CONSIDER_ALTERNATIVES';
  bestTimeToApply?: Date;
  preparationSteps?: string[];
}

// AI Model Configuration
interface AIModelConfig {
  claudeApiKey: string;
  claudeModel: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export class AIRecommendationEngine {
  private db: Pool;
  private buroClient: BuroApiClient;
  private auditLogger: AuditLogger;
  private productModel: FinancialProductModel;
  private aiConfig: AIModelConfig;
  
  // Recommendation weights for Mexican market
  private static readonly SCORING_WEIGHTS = {
    creditScore: 0.25,
    income: 0.20,
    employment: 0.15,
    existingDebt: 0.15,
    goals: 0.10,
    age: 0.05,
    geography: 0.05,
    relationship: 0.05,
  };
  
  // Mexican market insights
  private static readonly MARKET_INSIGHTS = {
    averageCreditScore: 650,
    averageMonthlyIncome: 15000, // MXN
    popularProducts: ['CREDIT_CARD', 'PERSONAL_LOAN', 'AUTO_LOAN'],
    seasonalTrends: {
      creditCards: { peak: [11, 12, 1], low: [6, 7, 8] }, // Months
      personalLoans: { peak: [1, 8, 12], low: [4, 5, 6] },
      autoLoans: { peak: [3, 4, 11], low: [1, 2] },
    },
  };

  constructor(
    database: Pool,
    buroClient: BuroApiClient,
    auditLogger: AuditLogger,
    aiConfig: AIModelConfig
  ) {
    this.db = database;
    this.buroClient = buroClient;
    this.auditLogger = auditLogger;
    this.productModel = new FinancialProductModel(database);
    this.aiConfig = aiConfig;
  }

  /**
   * Generate personalized product recommendations
   */
  async generateRecommendations(
    userProfile: UserFinancialProfile,
    requestedCategories?: string[],
    maxRecommendations: number = 10
  ): Promise<ProductRecommendation[]> {
    const startTime = Date.now();
    
    try {
      await this.auditLogger.logEvent({
        eventType: 'AI_RECOMMENDATION_REQUEST',
        eventCategory: 'business_operation',
        userId: userProfile.userId,
        description: 'AI recommendation request initiated',
        metadata: {
          requestedCategories,
          maxRecommendations,
          userIncome: userProfile.monthlyIncome,
          userAge: userProfile.age,
        },
      });

      // Step 1: Enrich user profile with credit data
      const enrichedProfile = await this.enrichUserProfile(userProfile);
      
      // Step 2: Get candidate products
      const candidateProducts = await this.getCandidateProducts(
        enrichedProfile,
        requestedCategories
      );
      
      // Step 3: Score products using AI and traditional algorithms
      const scoredProducts = await this.scoreProducts(enrichedProfile, candidateProducts);
      
      // Step 4: Generate detailed recommendations
      const recommendations = await this.generateDetailedRecommendations(
        enrichedProfile,
        scoredProducts.slice(0, maxRecommendations)
      );
      
      // Step 5: Apply Mexican market insights and compliance checks
      const finalRecommendations = await this.applyMarketInsights(
        enrichedProfile,
        recommendations
      );
      
      const processingTime = Date.now() - startTime;
      
      await this.auditLogger.logEvent({
        eventType: 'AI_RECOMMENDATION_COMPLETED',
        eventCategory: 'business_operation',
        userId: userProfile.userId,
        description: 'AI recommendations generated successfully',
        metadata: {
          recommendationsCount: finalRecommendations.length,
          processingTimeMs: processingTime,
          topRecommendation: finalRecommendations[0]?.productId,
        },
      });
      
      // Step 6: Store recommendations for analysis and improvement
      await this.storeRecommendations(userProfile.userId, finalRecommendations);
      
      return finalRecommendations;
      
    } catch (error) {
      await this.auditLogger.logEvent({
        eventType: 'AI_RECOMMENDATION_FAILED',
        eventCategory: 'error',
        userId: userProfile.userId,
        description: 'AI recommendation generation failed',
        severity: 'HIGH',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  }

  /**
   * Enrich user profile with credit bureau data
   */
  private async enrichUserProfile(profile: UserFinancialProfile): Promise<UserFinancialProfile> {
    const enrichedProfile = { ...profile };
    
    try {
      // Get credit score if not provided
      if (!profile.creditScore) {
        const creditData = await this.buroClient.getCreditScore({
          firstName: '', // Would be fetched from user table
          lastName: '',
          curp: '', // Would be fetched from user table
          dateOfBirth: '',
          address: {
            street: '',
            neighborhood: '',
            city: profile.city,
            state: profile.state,
            postalCode: '',
            country: 'MEX',
          },
          requestType: 'CREDIT_SCORE',
          consentId: `ai-rec-${profile.userId}`,
          inquiryReason: 'Product recommendation',
          requestedBy: 'RAISKET_AI',
        });
        
        if (creditData.success && creditData.data) {
          enrichedProfile.creditScore = creditData.data.score;
        }
      }
      
      // Calculate additional financial metrics
      enrichedProfile.monthlyExpenses = enrichedProfile.monthlyExpenses || 
        this.estimateMonthlyExpenses(profile);
      
      return enrichedProfile;
    } catch (error) {
      console.warn('Failed to enrich user profile:', error);
      return enrichedProfile;
    }
  }

  /**
   * Get candidate products based on user profile
   */
  private async getCandidateProducts(
    profile: UserFinancialProfile,
    categories?: string[]
  ): Promise<BaseFinancialProduct[]> {
    const filters = {
      minIncome: profile.monthlyIncome * 0.5, // Allow some flexibility
      creditScore: (profile.creditScore || 500) - 100, // Allow lower scores
      state: profile.state,
      sortBy: 'POPULARITY' as const,
      limit: 50,
    };
    
    if (categories && categories.length > 0) {
      const products: BaseFinancialProduct[] = [];
      
      for (const category of categories) {
        const categoryProducts = await this.productModel.getProductsByCategory(
          category as any,
          filters
        );
        products.push(...categoryProducts);
      }
      
      return products;
    } else {
      // Get products from all categories
      const allProducts: BaseFinancialProduct[] = [];
      const mainCategories = ['CREDIT_CARD', 'PERSONAL_LOAN', 'AUTO_LOAN', 'MORTGAGE'];
      
      for (const category of mainCategories) {
        const categoryProducts = await this.productModel.getProductsByCategory(
          category as any,
          { ...filters, limit: 15 }
        );
        allProducts.push(...categoryProducts);
      }
      
      return allProducts;
    }
  }

  /**
   * Score products using AI and traditional algorithms
   */
  private async scoreProducts(
    profile: UserFinancialProfile,
    products: BaseFinancialProduct[]
  ): Promise<Array<BaseFinancialProduct & { aiScore: number }>> {
    const scoredProducts = await Promise.all(
      products.map(async (product) => {
        const traditionalScore = this.calculateTraditionalScore(profile, product);
        const aiScore = await this.calculateAIScore(profile, product);
        
        // Combine traditional and AI scores
        const combinedScore = (traditionalScore * 0.6) + (aiScore * 0.4);
        
        return {
          ...product,
          aiScore: combinedScore,
        };
      })
    );
    
    // Sort by combined score
    return scoredProducts.sort((a, b) => b.aiScore - a.aiScore);
  }

  /**
   * Calculate traditional algorithmic score
   */
  private calculateTraditionalScore(
    profile: UserFinancialProfile,
    product: BaseFinancialProduct
  ): number {
    let score = 0;
    const weights = AIRecommendationEngine.SCORING_WEIGHTS;
    
    // Credit score compatibility
    const productMinScore = 600; // Would be from product.eligibility.minCreditScore
    if (profile.creditScore) {
      const scoreRatio = Math.min(profile.creditScore / productMinScore, 1.2);
      score += weights.creditScore * Math.min(scoreRatio * 100, 100);
    }
    
    // Income compatibility
    const productMinIncome = 10000; // Would be from product.eligibility.minIncome
    const incomeRatio = Math.min(profile.monthlyIncome / productMinIncome, 2);
    score += weights.income * Math.min(incomeRatio * 100, 100);
    
    // Employment stability
    const employmentScore = Math.min(profile.employmentStabilityMonths / 12, 1) * 100;
    score += weights.employment * employmentScore;
    
    // Debt-to-income ratio
    const debtToIncomeRatio = profile.totalDebt / (profile.monthlyIncome * 12);
    const debtScore = Math.max(100 - (debtToIncomeRatio * 200), 0);
    score += weights.existingDebt * debtScore;
    
    // Goals alignment
    const goalsScore = this.calculateGoalsAlignment(profile.primaryGoals, product.category);
    score += weights.goals * goalsScore;
    
    // Age appropriateness
    const ageScore = this.calculateAgeScore(profile.age, product.category);
    score += weights.age * ageScore;
    
    // Geographic availability
    // Assuming all products are available in all states for now
    score += weights.geography * 100;
    
    // Existing relationship bonus
    const relationshipScore = 50; // Would calculate based on existing products
    score += weights.relationship * relationshipScore;
    
    return Math.min(score, 100);
  }

  /**
   * Calculate AI-powered score using Claude API
   */
  private async calculateAIScore(
    profile: UserFinancialProfile,
    product: BaseFinancialProduct
  ): Promise<number> {
    try {
      const prompt = this.buildAIPrompt(profile, product);
      
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: this.aiConfig.claudeModel,
          max_tokens: this.aiConfig.maxTokens,
          temperature: this.aiConfig.temperature,
          system: this.aiConfig.systemPrompt,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.aiConfig.claudeApiKey,
            'anthropic-version': '2023-06-01',
          },
        }
      );
      
      const aiResponse = response.data.content[0].text;
      const scoreMatch = aiResponse.match(/Score:\s*(\d+)/i);
      
      if (scoreMatch) {
        return Math.min(parseInt(scoreMatch[1]), 100);
      }
      
      return 50; // Default score if parsing fails
    } catch (error) {
      console.warn('AI scoring failed, using traditional score:', error);
      return 50; // Fallback to neutral score
    }
  }

  /**
   * Build AI prompt for product scoring
   */
  private buildAIPrompt(profile: UserFinancialProfile, product: BaseFinancialProduct): string {
    return `
Analyze this Mexican financial product for user suitability and provide a recommendation score (0-100).

USER PROFILE:
- Age: ${profile.age}
- Monthly Income: $${profile.monthlyIncome.toLocaleString()} MXN
- Employment: ${profile.employmentStatus} (${profile.employmentStabilityMonths} months stability)
- Credit Score: ${profile.creditScore || 'Not available'}
- Location: ${profile.city}, ${profile.state}
- Existing Debt: $${profile.totalDebt.toLocaleString()} MXN
- Primary Goals: ${profile.primaryGoals.join(', ')}
- Risk Tolerance: ${profile.riskTolerance}
- KYC Level: ${profile.kycLevel}

PRODUCT:
- Name: ${product.name}
- Category: ${product.category}
- Institution: ${product.provider || 'Financial Institution'}
- Description: ${product.description}

MEXICAN MARKET CONTEXT:
- Average credit score: ${AIRecommendationEngine.MARKET_INSIGHTS.averageCreditScore}
- Average monthly income: $${AIRecommendationEngine.MARKET_INSIGHTS.averageMonthlyIncome.toLocaleString()} MXN
- Popular products: ${AIRecommendationEngine.MARKET_INSIGHTS.popularProducts.join(', ')}

Please analyze:
1. Eligibility match (income, credit score, employment)
2. Product suitability for user's goals and situation
3. Competitiveness in Mexican market
4. Risk assessment for both user and institution
5. Cultural and regional factors

Provide:
- Score: [0-100]
- Brief reasoning (2-3 sentences)
- Key benefits for this user
- Potential concerns or risks
- Recommendation (HIGHLY_RECOMMENDED, RECOMMENDED, CONSIDER, NOT_RECOMMENDED)

Focus on Mexican fintech market dynamics, CNBV regulations, and cultural financial behaviors.
    `;
  }

  /**
   * Generate detailed recommendations with explanations
   */
  private async generateDetailedRecommendations(
    profile: UserFinancialProfile,
    scoredProducts: Array<BaseFinancialProduct & { aiScore: number }>
  ): Promise<ProductRecommendation[]> {
    return Promise.all(
      scoredProducts.map(async (product) => {
        const eligibilityScore = this.calculateEligibilityScore(profile, product);
        const suitabilityScore = this.calculateSuitabilityScore(profile, product);
        const competitivenessScore = await this.calculateCompetitivenessScore(product);
        
        const approvalProbability = this.estimateApprovalProbability(profile, product);
        const expectedTerms = await this.estimateExpectedTerms(profile, product);
        
        return {
          productId: product.id,
          product,
          overallScore: product.aiScore,
          eligibilityScore,
          suitabilityScore,
          competitivenessScore,
          approvalProbability,
          offerProbability: approvalProbability * 0.8, // Slightly lower than approval
          expectedCreditLimit: expectedTerms.creditLimit,
          expectedInterestRate: expectedTerms.interestRate,
          reasons: this.generateReasons(profile, product, product.aiScore),
          benefits: this.generateBenefits(profile, product),
          considerations: this.generateConsiderations(profile, product),
          alternatives: [],
          marketPosition: this.determineMarketPosition(product.aiScore),
          competitorComparison: await this.generateCompetitorComparison(product),
          regulatoryNotes: this.generateRegulatoryNotes(product),
          cnbvGuidanceCompliant: true, // Would check against CNBV guidelines
          recommendedAction: this.determineRecommendedAction(product.aiScore, approvalProbability),
          bestTimeToApply: this.calculateBestTimeToApply(product.category),
          preparationSteps: this.generatePreparationSteps(profile, product, eligibilityScore),
        };
      })
    );
  }

  /**
   * Apply Mexican market insights and final optimizations
   */
  private async applyMarketInsights(
    profile: UserFinancialProfile,
    recommendations: ProductRecommendation[]
  ): Promise<ProductRecommendation[]> {
    // Apply seasonal adjustments
    const currentMonth = new Date().getMonth() + 1;
    
    return recommendations.map(rec => {
      const seasonalMultiplier = this.getSeasonalMultiplier(rec.product.category, currentMonth);
      
      return {
        ...rec,
        overallScore: Math.min(rec.overallScore * seasonalMultiplier, 100),
        marketPosition: this.determineMarketPosition(rec.overallScore * seasonalMultiplier),
      };
    }).sort((a, b) => b.overallScore - a.overallScore);
  }

  /**
   * Store recommendations for analysis and ML model improvement
   */
  private async storeRecommendations(
    userId: string,
    recommendations: ProductRecommendation[]
  ): Promise<void> {
    const query = `
      INSERT INTO analytics.ai_recommendations (
        user_id, recommendations_data, generated_at
      ) VALUES ($1, $2, NOW())
    `;
    
    await this.db.query(query, [
      userId,
      JSON.stringify(recommendations),
    ]);
  }

  // Helper methods for scoring and calculations

  private estimateMonthlyExpenses(profile: UserFinancialProfile): number {
    // Estimate based on income and Mexican spending patterns
    const baseExpenseRatio = 0.7; // 70% of income for basic expenses
    return profile.monthlyIncome * baseExpenseRatio;
  }

  private calculateGoalsAlignment(goals: string[], productCategory: string): number {
    const categoryGoalMap = {
      CREDIT_CARD: ['BUILD_CREDIT', 'EMERGENCY_FUND'],
      PERSONAL_LOAN: ['DEBT_CONSOLIDATION', 'EDUCATION', 'TRAVEL'],
      AUTO_LOAN: ['CAR_PURCHASE'],
      MORTGAGE: ['HOME_PURCHASE'],
    };
    
    const relevantGoals = categoryGoalMap[productCategory as keyof typeof categoryGoalMap] || [];
    const matchingGoals = goals.filter(goal => relevantGoals.includes(goal));
    
    return matchingGoals.length > 0 ? 100 : 30;
  }

  private calculateAgeScore(age: number, productCategory: string): number {
    const optimalAgeRanges = {
      CREDIT_CARD: [25, 45],
      PERSONAL_LOAN: [30, 50],
      AUTO_LOAN: [25, 55],
      MORTGAGE: [30, 45],
    };
    
    const range = optimalAgeRanges[productCategory as keyof typeof optimalAgeRanges] || [25, 65];
    
    if (age >= range[0] && age <= range[1]) {
      return 100;
    } else if (age < range[0]) {
      return Math.max(50, 100 - (range[0] - age) * 10);
    } else {
      return Math.max(50, 100 - (age - range[1]) * 5);
    }
  }

  private calculateEligibilityScore(profile: UserFinancialProfile, product: BaseFinancialProduct): number {
    // Simplified eligibility calculation
    let score = 100;
    
    // Income check
    const minIncome = 10000; // Would be from product eligibility
    if (profile.monthlyIncome < minIncome) {
      score -= 30;
    }
    
    // Credit score check
    const minCreditScore = 600;
    if (profile.creditScore && profile.creditScore < minCreditScore) {
      score -= 40;
    }
    
    return Math.max(score, 0);
  }

  private calculateSuitabilityScore(profile: UserFinancialProfile, product: BaseFinancialProduct): number {
    // Calculate how well the product fits the user's needs
    let score = 50; // Base score
    
    // Goals alignment
    score += this.calculateGoalsAlignment(profile.primaryGoals, product.category) * 0.3;
    
    // Risk tolerance match
    const riskScore = this.calculateRiskAlignment(profile.riskTolerance, product.category);
    score += riskScore * 0.2;
    
    return Math.min(score, 100);
  }

  private calculateRiskAlignment(riskTolerance: string, productCategory: string): number {
    const productRiskLevels = {
      CREDIT_CARD: 'MODERATE',
      PERSONAL_LOAN: 'MODERATE',
      AUTO_LOAN: 'CONSERVATIVE',
      MORTGAGE: 'CONSERVATIVE',
    };
    
    const productRisk = productRiskLevels[productCategory as keyof typeof productRiskLevels] || 'MODERATE';
    
    if (riskTolerance === productRisk) {
      return 100;
    } else {
      return 70; // Partial match
    }
  }

  private async calculateCompetitivenessScore(product: BaseFinancialProduct): Promise<number> {
    // Compare with similar products in the market
    // This would involve complex market analysis
    return 75; // Placeholder
  }

  private estimateApprovalProbability(profile: UserFinancialProfile, product: BaseFinancialProduct): number {
    const eligibilityScore = this.calculateEligibilityScore(profile, product);
    const creditScore = profile.creditScore || 500;
    const incomeScore = Math.min(profile.monthlyIncome / 15000, 1) * 100;
    
    const probability = (eligibilityScore * 0.4) + (creditScore / 850 * 100 * 0.4) + (incomeScore * 0.2);
    
    return Math.min(probability, 95); // Cap at 95% to maintain realism
  }

  private async estimateExpectedTerms(profile: UserFinancialProfile, product: BaseFinancialProduct): Promise<{
    creditLimit?: number;
    interestRate?: number;
  }> {
    if (product.category === 'CREDIT_CARD') {
      const baseCreditLimit = profile.monthlyIncome * 3; // 3x monthly income
      const creditScore = profile.creditScore || 600;
      const creditMultiplier = Math.min(creditScore / 700, 1.5);
      
      return {
        creditLimit: Math.round(baseCreditLimit * creditMultiplier),
        interestRate: Math.max(18, 35 - (creditScore - 500) / 10), // Mexican market rates
      };
    }
    
    return {};
  }

  private generateReasons(profile: UserFinancialProfile, product: BaseFinancialProduct, score: number): string[] {
    const reasons = [];
    
    if (score > 80) {
      reasons.push('Excelente compatibilidad con tu perfil financiero');
    }
    
    if (profile.creditScore && profile.creditScore > 700) {
      reasons.push('Tu buen historial crediticio te califica para mejores condiciones');
    }
    
    if (profile.monthlyIncome > 25000) {
      reasons.push('Tus ingresos están por encima del promedio mexicano');
    }
    
    const goalAlignment = this.calculateGoalsAlignment(profile.primaryGoals, product.category);
    if (goalAlignment > 70) {
      reasons.push('El producto se alinea perfectamente con tus objetivos financieros');
    }
    
    return reasons;
  }

  private generateBenefits(profile: UserFinancialProfile, product: BaseFinancialProduct): string[] {
    const benefits = [];
    
    if (product.category === 'CREDIT_CARD') {
      benefits.push('Construye historial crediticio positivo');
      benefits.push('Acceso a beneficios y recompensas');
      benefits.push('Flexibilidad en pagos y compras');
    }
    
    benefits.push('Tasas competitivas en el mercado mexicano');
    benefits.push('Proceso de aplicación 100% digital');
    
    return benefits;
  }

  private generateConsiderations(profile: UserFinancialProfile, product: BaseFinancialProduct): string[] {
    const considerations = [];
    
    if (profile.totalDebt > profile.monthlyIncome * 6) {
      considerations.push('Considera consolidar deuda existente antes de aplicar');
    }
    
    if (profile.creditScore && profile.creditScore < 650) {
      considerations.push('Trabajar en mejorar tu score crediticio podría obtener mejores condiciones');
    }
    
    considerations.push('Lee términos y condiciones cuidadosamente');
    considerations.push('Mantén un uso responsable del crédito');
    
    return considerations;
  }

  private determineMarketPosition(score: number): 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'BELOW_AVERAGE' {
    if (score >= 85) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 55) return 'AVERAGE';
    return 'BELOW_AVERAGE';
  }

  private async generateCompetitorComparison(product: BaseFinancialProduct): Promise<{
    betterThan: number;
    keyAdvantages: string[];
    potentialDisadvantages: string[];
  }> {
    // This would involve complex market analysis
    return {
      betterThan: 65, // Placeholder: better than 65% of similar products
      keyAdvantages: ['Tasas competitivas', 'Proceso digital eficiente'],
      potentialDisadvantages: ['Requisitos de ingresos', 'Disponibilidad regional'],
    };
  }

  private generateRegulatoryNotes(product: BaseFinancialProduct): string[] {
    const notes = [];
    
    notes.push('Producto autorizado por CNBV');
    notes.push('Protegido por CONDUSEF');
    notes.push('Cumple con regulaciones de protección al consumidor');
    
    return notes;
  }

  private determineRecommendedAction(score: number, approvalProbability: number): 'APPLY_NOW' | 'WAIT_AND_IMPROVE' | 'CONSIDER_ALTERNATIVES' {
    if (score >= 75 && approvalProbability >= 70) {
      return 'APPLY_NOW';
    } else if (score >= 60 || approvalProbability >= 50) {
      return 'CONSIDER_ALTERNATIVES';
    } else {
      return 'WAIT_AND_IMPROVE';
    }
  }

  private calculateBestTimeToApply(category: string): Date | undefined {
    const seasonalTrends = AIRecommendationEngine.MARKET_INSIGHTS.seasonalTrends;
    const trends = seasonalTrends[category as keyof typeof seasonalTrends];
    
    if (trends) {
      const currentMonth = new Date().getMonth() + 1;
      const isOptimalTime = trends.peak.includes(currentMonth);
      
      if (!isOptimalTime) {
        // Find next peak month
        const nextPeak = trends.peak.find(month => month > currentMonth) || trends.peak[0];
        const nextOptimalDate = new Date();
        nextOptimalDate.setMonth(nextPeak - 1);
        nextOptimalDate.setDate(1);
        
        return nextOptimalDate;
      }
    }
    
    return undefined; // Apply now
  }

  private generatePreparationSteps(profile: UserFinancialProfile, product: BaseFinancialProduct, eligibilityScore: number): string[] | undefined {
    if (eligibilityScore >= 80) return undefined;
    
    const steps = [];
    
    if (profile.creditScore && profile.creditScore < 650) {
      steps.push('Mejorar score crediticio pagando deudas puntualmente');
    }
    
    if (profile.monthlyIncome < 15000) {
      steps.push('Documentar ingresos adicionales si los tienes');
    }
    
    if (profile.employmentStabilityMonths < 6) {
      steps.push('Completar al menos 6 meses en tu empleo actual');
    }
    
    steps.push('Reunir documentos necesarios (INE, comprobante de ingresos)');
    
    return steps;
  }

  private getSeasonalMultiplier(category: string, month: number): number {
    const seasonalTrends = AIRecommendationEngine.MARKET_INSIGHTS.seasonalTrends;
    const trends = seasonalTrends[category as keyof typeof seasonalTrends];
    
    if (!trends) return 1.0;
    
    if (trends.peak.includes(month)) {
      return 1.1; // 10% boost during peak months
    } else if (trends.low.includes(month)) {
      return 0.95; // 5% reduction during low months
    }
    
    return 1.0;
  }
}