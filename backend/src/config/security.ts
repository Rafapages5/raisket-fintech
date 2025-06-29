/**
 * Enterprise Security Framework for Mexican Fintech Platform
 * Compliant with CNBV, Condusef, and international security standards
 */

import { Algorithm } from 'jsonwebtoken';
import { CorsOptions } from 'cors';

// Security Configuration Constants
export const SECURITY_CONFIG = {
  // JWT Configuration
  JWT: {
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d',
    ALGORITHM: 'RS256' as Algorithm,
    ISSUER: 'raisket-mx',
    AUDIENCE: 'raisket-users',
  },

  // Password Policy (CNBV Requirements)
  PASSWORD: {
    MIN_LENGTH: 12,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MINUTES: 30,
    PASSWORD_HISTORY_COUNT: 12, // Cannot reuse last 12 passwords
    PASSWORD_EXPIRY_DAYS: 90,
  },

  // Session Management
  SESSION: {
    MAX_CONCURRENT_SESSIONS: 3,
    IDLE_TIMEOUT_MINUTES: 30,
    ABSOLUTE_TIMEOUT_HOURS: 8,
    SECURE_COOKIES: true,
    SAME_SITE: 'strict' as const,
  },

  // Rate Limiting
  RATE_LIMITING: {
    // General API rate limits
    GENERAL: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 1000,
    },
    // Authentication endpoints (stricter)
    AUTH: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 10,
    },
    // Credit score queries (regulated)
    CREDIT_QUERIES: {
      WINDOW_MS: 24 * 60 * 60 * 1000, // 24 hours
      MAX_REQUESTS: 3, // Mexican regulation: max 3 per day
    },
    // Buró de Crédito API calls
    BURO_API: {
      WINDOW_MS: 60 * 1000, // 1 minute
      MAX_REQUESTS: 10,
    },
  },

  // Encryption Configuration
  ENCRYPTION: {
    ALGORITHM: 'aes-256-gcm',
    KEY_LENGTH: 32,
    IV_LENGTH: 16,
    TAG_LENGTH: 16,
    ITERATIONS: 100000, // PBKDF2 iterations
  },

  // CORS Configuration
  CORS: {
    PRODUCTION: {
      origin: [
        'https://raisket.mx',
        'https://www.raisket.mx',
        'https://app.raisket.mx'
      ],
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-API-Key',
        'X-Request-ID'
      ],
    } as CorsOptions,
    DEVELOPMENT: {
      origin: true,
      credentials: true,
    } as CorsOptions,
  },

  // Headers Security
  SECURITY_HEADERS: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },

  // File Upload Security
  FILE_UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_MIME_TYPES: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    VIRUS_SCAN_REQUIRED: true,
    QUARANTINE_DIRECTORY: '/tmp/quarantine',
  },

  // Mexican Regulatory Compliance
  MEXICAN_COMPLIANCE: {
    // LFPDPPP (Mexican Data Protection Law)
    DATA_RETENTION_YEARS: 7,
    CONSENT_EXPIRY_YEARS: 2,
    
    // CNBV Requirements
    AUDIT_LOG_RETENTION_YEARS: 10,
    TRANSACTION_LOG_RETENTION_YEARS: 7,
    
    // Buró de Crédito Compliance
    CREDIT_INQUIRY_RETENTION_YEARS: 6,
    CREDIT_REPORT_CACHE_HOURS: 24,
  },

  // IP Whitelisting for sensitive operations
  IP_WHITELIST: {
    ADMIN_OPERATIONS: [
      // Add specific IP ranges for admin access
    ],
    BURO_INTEGRATION: [
      // Buró de Crédito IP ranges (to be configured)
    ],
    BANKING_PARTNERS: [
      // Bank API IP ranges (to be configured)
    ],
  },

  // API Security
  API: {
    REQUIRE_API_KEY: true,
    API_KEY_HEADER: 'X-API-Key',
    REQUEST_ID_HEADER: 'X-Request-ID',
    SIGNATURE_HEADER: 'X-Signature',
    TIMESTAMP_HEADER: 'X-Timestamp',
    MAX_REQUEST_AGE_SECONDS: 300, // 5 minutes
  },
} as const;

// Security Validation Functions
export class SecurityValidator {
  /**
   * Validate password against Mexican fintech requirements
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const config = SECURITY_CONFIG.PASSWORD;

    if (password.length < config.MIN_LENGTH) {
      errors.push(`La contraseña debe tener al menos ${config.MIN_LENGTH} caracteres`);
    }

    if (password.length > config.MAX_LENGTH) {
      errors.push(`La contraseña no puede exceder ${config.MAX_LENGTH} caracteres`);
    }

    if (config.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }

    if (config.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }

    if (config.REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }

    if (config.REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('La contraseña no puede contener más de dos caracteres consecutivos iguales');
    }

    // Check for sequential characters
    if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
      errors.push('La contraseña no puede contener secuencias alfabéticas');
    }

    if (/(?:123|234|345|456|567|678|789|890|012)/.test(password)) {
      errors.push('La contraseña no puede contener secuencias numéricas');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate Mexican CURP format
   */
  static validateCURP(curp: string): boolean {
    const curpPattern = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/;
    return curpPattern.test(curp);
  }

  /**
   * Validate Mexican RFC format
   */
  static validateRFC(rfc: string): boolean {
    // RFC can be 12 (individual) or 13 (with homoclave) characters
    const rfcPattern = /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{0,3}$/;
    return rfcPattern.test(rfc) && (rfc.length === 12 || rfc.length === 13);
  }

  /**
   * Validate email format with additional security checks
   */
  static validateEmail(email: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errors.push('Formato de email inválido');
    }

    // Length validation
    if (email.length > 255) {
      errors.push('El email no puede exceder 255 caracteres');
    }

    // Domain validation (basic)
    const domain = email.split('@')[1];
    if (domain && domain.length > 253) {
      errors.push('Dominio de email inválido');
    }

    // Check for disposable email domains (basic list)
    const disposableDomains = [
      '10minutemail.com',
      'guerrillamail.com',
      'temp-mail.org',
      'throwaway.email'
    ];
    
    if (domain && disposableDomains.includes(domain.toLowerCase())) {
      errors.push('No se permiten direcciones de email temporales');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate phone number (Mexican format)
   */
  static validateMexicanPhone(phone: string): boolean {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Mexican phone numbers can be:
    // - 10 digits (mobile): XXXXXXXXXX
    // - 11 digits (landline with area code): 1XXXXXXXXXX
    // - With country code: +52XXXXXXXXXX or 52XXXXXXXXXX
    
    if (digits.length === 10) {
      // Mobile number
      return /^[1-9][0-9]{9}$/.test(digits);
    } else if (digits.length === 11) {
      // Landline with area code
      return /^1[0-9]{10}$/.test(digits);
    } else if (digits.length === 12) {
      // With country code 52
      return /^52[1-9][0-9]{9}$/.test(digits);
    }
    
    return false;
  }

  /**
   * Validate IP address is in allowed range
   */
  static validateIPWhitelist(ip: string, whitelist: string[]): boolean {
    if (whitelist.length === 0) return true; // No restrictions
    
    // Simple IP validation - in production, use proper CIDR matching
    return whitelist.some(allowedIP => {
      if (allowedIP.includes('/')) {
        // CIDR notation - implement proper subnet matching
        return false; // Placeholder
      }
      return ip === allowedIP;
    });
  }
}

// Encryption utilities
export class EncryptionUtils {
  private static readonly config = SECURITY_CONFIG.ENCRYPTION;

  /**
   * Generate a secure random key
   */
  static generateKey(): Buffer {
    return require('crypto').randomBytes(this.config.KEY_LENGTH);
  }

  /**
   * Generate a secure random IV
   */
  static generateIV(): Buffer {
    return require('crypto').randomBytes(this.config.IV_LENGTH);
  }

  /**
   * Encrypt sensitive data (PII)
   */
  static encrypt(data: string, key: Buffer): {
    encrypted: string;
    iv: string;
    tag: string;
  } {
    const crypto = require('crypto');
    const iv = this.generateIV();
    const cipher = crypto.createCipher(this.config.ALGORITHM, key, { iv });
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedData: {
    encrypted: string;
    iv: string;
    tag: string;
  }, key: Buffer): string {
    const crypto = require('crypto');
    const decipher = crypto.createDecipher(
      this.config.ALGORITHM,
      key,
      { iv: Buffer.from(encryptedData.iv, 'hex') }
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Hash password with salt
   */
  static async hashPassword(password: string): Promise<{
    hash: string;
    salt: string;
  }> {
    const crypto = require('crypto');
    const salt = crypto.randomBytes(32).toString('hex');
    
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, this.config.ITERATIONS, 64, 'sha512', (err: Error, derivedKey: Buffer) => {
        if (err) reject(err);
        resolve({
          hash: derivedKey.toString('hex'),
          salt,
        });
      });
    });
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const crypto = require('crypto');
    
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, this.config.ITERATIONS, 64, 'sha512', (err: Error, derivedKey: Buffer) => {
        if (err) reject(err);
        resolve(hash === derivedKey.toString('hex'));
      });
    });
  }
}

// Export type definitions
export type SecurityConfig = typeof SECURITY_CONFIG;
export type PasswordValidationResult = ReturnType<typeof SecurityValidator.validatePassword>;
export type EmailValidationResult = ReturnType<typeof SecurityValidator.validateEmail>;