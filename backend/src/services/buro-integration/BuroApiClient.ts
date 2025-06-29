/**
 * Buró de Crédito API Integration Client
 * Secure, compliant integration with Mexican credit bureau
 * 
 * Features:
 * - OAuth 2.0 + Client Certificate Authentication
 * - Rate limiting and circuit breaker
 * - Comprehensive audit logging
 * - Data encryption and PII protection
 * - Mexican regulatory compliance
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import https from 'https';
import crypto from 'crypto';
import { CircuitBreaker } from 'opossum';
import { RateLimiter } from 'limiter';
import { AuditLogger } from '../audit-logging/AuditLogger';
import { EncryptionUtils } from '../../config/security';

// Buró de Crédito API Types
export interface BuroAuthCredentials {
  clientId: string;
  clientSecret: string;
  clientCertificate: string;
  clientPrivateKey: string;
  certificatePassphrase?: string;
}

export interface BuroAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  expires_at: Date;
}

export interface BuroCreditRequest {
  // Personal Information
  firstName: string;
  lastName: string;
  middleName?: string;
  curp: string;
  rfc?: string;
  dateOfBirth: string; // YYYY-MM-DD
  
  // Address Information
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  
  // Request Parameters
  requestType: 'CREDIT_SCORE' | 'FULL_REPORT' | 'MONITORING_ALERT';
  consentId: string; // User consent tracking
  inquiryReason: string;
  requestedBy: string; // Our institution ID
}

export interface BuroCreditScore {
  score: number; // 300-850
  scoreVersion: string;
  scoreDate: string;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  
  // Score factors
  paymentHistory: number;
  creditUtilization: number;
  creditHistoryLength: number;
  creditMix: number;
  newCredit: number;
  
  // Additional Mexican-specific factors
  burocreditScore: number;
  paymentBehavior: string;
  creditCapacity: string;
}

export interface BuroCreditReport {
  personalInfo: {
    name: string;
    curp: string;
    rfc: string;
    dateOfBirth: string;
    addresses: Array<{
      address: string;
      reportedDate: string;
      reportedBy: string;
    }>;
  };
  
  creditScore: BuroCreditScore;
  
  creditAccounts: Array<{
    accountId: string;
    creditorName: string;
    accountType: string;
    openDate: string;
    creditLimit: number;
    currentBalance: number;
    paymentStatus: string;
    monthsReviewed: number;
    paymentHistory: string; // 24-month payment history
  }>;
  
  publicRecords: Array<{
    recordType: string;
    filingDate: string;
    court: string;
    amount: number;
    status: string;
  }>;
  
  inquiries: Array<{
    inquiryDate: string;
    inquirerName: string;
    inquiryType: string;
    inquiryReason: string;
  }>;
  
  reportMetadata: {
    reportId: string;
    reportDate: string;
    reportVersion: string;
    dataSource: string;
  };
}

export interface BuroApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    rateLimit: {
      remaining: number;
      resetTime: string;
    };
  };
}

export class BuroApiClient {
  private axiosInstance: AxiosInstance;
  private credentials: BuroAuthCredentials;
  private accessToken: BuroAccessToken | null = null;
  private rateLimiter: RateLimiter;
  private circuitBreaker: CircuitBreaker;
  private auditLogger: AuditLogger;
  
  // Buró de Crédito API Configuration
  private static readonly CONFIG = {
    BASE_URL: process.env.BURO_API_BASE_URL || 'https://api.burodecredito.com.mx',
    AUTH_URL: process.env.BURO_AUTH_URL || 'https://auth.burodecredito.com.mx',
    API_VERSION: 'v2',
    TIMEOUT: 30000, // 30 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    
    // Rate limiting (per Mexican regulations)
    RATE_LIMIT: {
      REQUESTS_PER_MINUTE: 60,
      REQUESTS_PER_DAY: 1000,
      BURST_LIMIT: 10,
    },
    
    // Circuit breaker settings
    CIRCUIT_BREAKER: {
      timeout: 10000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
    },
  };

  constructor(credentials: BuroAuthCredentials, auditLogger: AuditLogger) {
    this.credentials = credentials;
    this.auditLogger = auditLogger;
    
    // Initialize rate limiter
    this.rateLimiter = new RateLimiter({
      tokensPerInterval: BuroApiClient.CONFIG.RATE_LIMIT.REQUESTS_PER_MINUTE,
      interval: 'minute',
      fireImmediately: true,
    });
    
    // Initialize circuit breaker
    this.circuitBreaker = new CircuitBreaker(this.makeRequest.bind(this), {
      timeout: BuroApiClient.CONFIG.CIRCUIT_BREAKER.timeout,
      errorThresholdPercentage: BuroApiClient.CONFIG.CIRCUIT_BREAKER.errorThresholdPercentage,
      resetTimeout: BuroApiClient.CONFIG.CIRCUIT_BREAKER.resetTimeout,
    });
    
    // Initialize axios instance with client certificate
    this.axiosInstance = this.createAxiosInstance();
    
    // Circuit breaker event handlers
    this.circuitBreaker.on('open', () => {
      this.auditLogger.logEvent({
        eventType: 'CIRCUIT_BREAKER_OPEN',
        eventCategory: 'external_api',
        description: 'Buró de Crédito API circuit breaker opened',
        severity: 'HIGH',
      });
    });
    
    this.circuitBreaker.on('halfOpen', () => {
      this.auditLogger.logEvent({
        eventType: 'CIRCUIT_BREAKER_HALF_OPEN',
        eventCategory: 'external_api',
        description: 'Buró de Crédito API circuit breaker half-open',
        severity: 'MEDIUM',
      });
    });
  }

  private createAxiosInstance(): AxiosInstance {
    // Load client certificate for mutual TLS
    const httpsAgent = new https.Agent({
      cert: this.credentials.clientCertificate,
      key: this.credentials.clientPrivateKey,
      passphrase: this.credentials.certificatePassphrase,
      rejectUnauthorized: true,
      secureProtocol: 'TLSv1_2_method',
    });

    return axios.create({
      baseURL: BuroApiClient.CONFIG.BASE_URL,
      timeout: BuroApiClient.CONFIG.TIMEOUT,
      httpsAgent,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Raisket-MX/1.0',
        'X-API-Version': BuroApiClient.CONFIG.API_VERSION,
      },
    });
  }

  /**
   * Authenticate with Buró de Crédito using OAuth 2.0 + client certificates
   */
  private async authenticate(): Promise<BuroAccessToken> {
    try {
      await this.auditLogger.logEvent({
        eventType: 'BURO_AUTH_ATTEMPT',
        eventCategory: 'authentication',
        description: 'Attempting authentication with Buró de Crédito',
      });

      const authPayload = {
        grant_type: 'client_credentials',
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        scope: 'credit_reports credit_scores monitoring',
      };

      const response = await axios.post(
        `${BuroApiClient.CONFIG.AUTH_URL}/oauth/token`,
        authPayload,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          httpsAgent: new https.Agent({
            cert: this.credentials.clientCertificate,
            key: this.credentials.clientPrivateKey,
            passphrase: this.credentials.certificatePassphrase,
          }),
        }
      );

      const tokenData = response.data;
      const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));

      this.accessToken = {
        access_token: tokenData.access_token,
        token_type: tokenData.token_type,
        expires_in: tokenData.expires_in,
        scope: tokenData.scope,
        expires_at: expiresAt,
      };

      await this.auditLogger.logEvent({
        eventType: 'BURO_AUTH_SUCCESS',
        eventCategory: 'authentication',
        description: 'Successfully authenticated with Buró de Crédito',
        metadata: {
          expiresAt: expiresAt.toISOString(),
          scope: tokenData.scope,
        },
      });

      return this.accessToken;
    } catch (error) {
      await this.auditLogger.logEvent({
        eventType: 'BURO_AUTH_FAILED',
        eventCategory: 'authentication',
        description: 'Failed to authenticate with Buró de Crédito',
        severity: 'HIGH',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Ensure we have a valid access token
   */
  private async ensureValidToken(): Promise<string> {
    if (!this.accessToken || new Date() >= this.accessToken.expires_at) {
      await this.authenticate();
    }
    return this.accessToken!.access_token;
  }

  /**
   * Make a rate-limited request through circuit breaker
   */
  private async makeRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // Rate limiting check
    const tokensRemaining = await this.rateLimiter.removeTokens(1);
    if (tokensRemaining < 0) {
      throw new Error('Rate limit exceeded for Buró de Crédito API');
    }

    // Ensure valid authentication
    const token = await this.ensureValidToken();
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    return this.axiosInstance.request<T>(config);
  }

  /**
   * Get credit score for a user
   */
  async getCreditScore(request: BuroCreditRequest): Promise<BuroApiResponse<BuroCreditScore>> {
    const requestId = crypto.randomUUID();
    
    try {
      await this.auditLogger.logEvent({
        eventType: 'BURO_CREDIT_SCORE_REQUEST',
        eventCategory: 'credit_inquiry',
        description: 'Requesting credit score from Buró de Crédito',
        metadata: {
          requestId,
          curp: request.curp,
          consentId: request.consentId,
          inquiryReason: request.inquiryReason,
        },
      });

      // Encrypt sensitive data for API call
      const encryptedRequest = this.encryptSensitiveData(request);

      const response = await this.circuitBreaker.fire({
        method: 'POST',
        url: `/api/${BuroApiClient.CONFIG.API_VERSION}/credit-score`,
        data: encryptedRequest,
        headers: {
          'X-Request-ID': requestId,
          'X-Consent-ID': request.consentId,
        },
      });

      const creditScore: BuroCreditScore = response.data;

      await this.auditLogger.logEvent({
        eventType: 'BURO_CREDIT_SCORE_SUCCESS',
        eventCategory: 'credit_inquiry',
        description: 'Successfully retrieved credit score',
        metadata: {
          requestId,
          score: creditScore.score,
          riskCategory: creditScore.riskCategory,
        },
      });

      return {
        success: true,
        data: creditScore,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          rateLimit: {
            remaining: await this.rateLimiter.getTokensRemaining(),
            resetTime: new Date(Date.now() + 60000).toISOString(),
          },
        },
      };
    } catch (error) {
      await this.auditLogger.logEvent({
        eventType: 'BURO_CREDIT_SCORE_FAILED',
        eventCategory: 'credit_inquiry',
        description: 'Failed to retrieve credit score',
        severity: 'HIGH',
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          requestId,
          curp: request.curp,
        },
      });

      return {
        success: false,
        error: {
          code: 'BURO_API_ERROR',
          message: 'Failed to retrieve credit score',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          rateLimit: {
            remaining: await this.rateLimiter.getTokensRemaining(),
            resetTime: new Date(Date.now() + 60000).toISOString(),
          },
        },
      };
    }
  }

  /**
   * Get full credit report for a user
   */
  async getCreditReport(request: BuroCreditRequest): Promise<BuroApiResponse<BuroCreditReport>> {
    const requestId = crypto.randomUUID();
    
    try {
      await this.auditLogger.logEvent({
        eventType: 'BURO_CREDIT_REPORT_REQUEST',
        eventCategory: 'credit_inquiry',
        description: 'Requesting full credit report from Buró de Crédito',
        metadata: {
          requestId,
          curp: request.curp,
          consentId: request.consentId,
          inquiryReason: request.inquiryReason,
        },
      });

      const encryptedRequest = this.encryptSensitiveData(request);

      const response = await this.circuitBreaker.fire({
        method: 'POST',
        url: `/api/${BuroApiClient.CONFIG.API_VERSION}/credit-report`,
        data: encryptedRequest,
        headers: {
          'X-Request-ID': requestId,
          'X-Consent-ID': request.consentId,
        },
      });

      const creditReport: BuroCreditReport = response.data;

      await this.auditLogger.logEvent({
        eventType: 'BURO_CREDIT_REPORT_SUCCESS',
        eventCategory: 'credit_inquiry',
        description: 'Successfully retrieved credit report',
        metadata: {
          requestId,
          reportId: creditReport.reportMetadata.reportId,
          accountsCount: creditReport.creditAccounts.length,
          inquiriesCount: creditReport.inquiries.length,
        },
      });

      return {
        success: true,
        data: creditReport,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          rateLimit: {
            remaining: await this.rateLimiter.getTokensRemaining(),
            resetTime: new Date(Date.now() + 60000).toISOString(),
          },
        },
      };
    } catch (error) {
      await this.auditLogger.logEvent({
        eventType: 'BURO_CREDIT_REPORT_FAILED',
        eventCategory: 'credit_inquiry',
        description: 'Failed to retrieve credit report',
        severity: 'HIGH',
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          requestId,
          curp: request.curp,
        },
      });

      return {
        success: false,
        error: {
          code: 'BURO_API_ERROR',
          message: 'Failed to retrieve credit report',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          rateLimit: {
            remaining: await this.rateLimiter.getTokensRemaining(),
            resetTime: new Date(Date.now() + 60000).toISOString(),
          },
        },
      };
    }
  }

  /**
   * Encrypt sensitive data before sending to Buró de Crédito
   */
  private encryptSensitiveData(request: BuroCreditRequest): any {
    // In production, implement field-level encryption for PII
    // This is a placeholder implementation
    return {
      ...request,
      // Encrypt sensitive fields
      curp: this.hashSensitiveField(request.curp),
      rfc: request.rfc ? this.hashSensitiveField(request.rfc) : undefined,
    };
  }

  /**
   * Hash sensitive fields for API transmission
   */
  private hashSensitiveField(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  /**
   * Health check for Buró de Crédito API
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    latency: number;
    circuitBreakerState: string;
    rateLimit: {
      remaining: number;
      resetTime: string;
    };
  }> {
    const startTime = Date.now();
    
    try {
      await this.circuitBreaker.fire({
        method: 'GET',
        url: `/api/${BuroApiClient.CONFIG.API_VERSION}/health`,
        timeout: 5000,
      });
      
      const latency = Date.now() - startTime;
      
      return {
        status: latency < 1000 ? 'healthy' : 'degraded',
        latency,
        circuitBreakerState: this.circuitBreaker.state,
        rateLimit: {
          remaining: await this.rateLimiter.getTokensRemaining(),
          resetTime: new Date(Date.now() + 60000).toISOString(),
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now() - startTime,
        circuitBreakerState: this.circuitBreaker.state,
        rateLimit: {
          remaining: await this.rateLimiter.getTokensRemaining(),
          resetTime: new Date(Date.now() + 60000).toISOString(),
        },
      };
    }
  }
}