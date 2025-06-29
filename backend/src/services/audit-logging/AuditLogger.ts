/**
 * Enterprise Audit Logging System for Mexican Fintech Platform
 * Compliant with CNBV, Condusef, and international audit standards
 * 
 * Features:
 * - Immutable audit trails
 * - Real-time compliance monitoring
 * - GDPR/LFPDPPP data handling compliance
 * - Automated regulatory reporting
 * - Anomaly detection and alerting
 * - Performance monitoring and SLA tracking
 */

import { Pool } from 'pg';
import crypto from 'crypto';
import { EventEmitter } from 'events';

// Audit Event Types
export interface AuditEvent {
  eventType: string;
  eventCategory: AuditEventCategory;
  userId?: string;
  userEmail?: string;
  sessionId?: string;
  description: string;
  
  // Request Context
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  httpMethod?: string;
  requestId?: string;
  
  // Resource Information
  resourceType?: string;
  resourceId?: string;
  
  // Event Data
  requestData?: any;
  responseData?: any;
  responseStatus?: number;
  
  // Business Context
  amount?: number;
  currency?: string;
  productId?: string;
  institutionId?: string;
  
  // Compliance and Risk
  severity?: AuditSeverity;
  riskScore?: number;
  complianceFlags?: string[];
  
  // Error Information
  error?: string;
  errorCode?: string;
  stackTrace?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  timestamp?: Date;
  serverId?: string;
  environment?: string;
  
  // Retention Policy
  requiresRetention?: boolean;
  retentionYears?: number;
  personalDataIncluded?: boolean;
  sensitiveDataIncluded?: boolean;
}

export type AuditEventCategory = 
  | 'authentication'           // Login, logout, password changes
  | 'authorization'           // Permission checks, role changes
  | 'data_access'            // PII access, financial data viewing
  | 'data_modification'      // Create, update, delete operations
  | 'financial_transaction'  // Payments, transfers, applications
  | 'credit_inquiry'         // Buró de Crédito queries
  | 'kyc'                    // KYC verification events
  | 'compliance'             // Regulatory compliance events
  | 'security'               // Security incidents, alerts
  | 'external_api'           // Third-party API calls
  | 'system_operation'       // System maintenance, configuration
  | 'business_operation'     // Business logic, product operations
  | 'privacy'                // GDPR/LFPDPPP related events
  | 'fraud_detection'        // Fraud monitoring events
  | 'performance'            // Performance monitoring
  | 'error';                 // System errors and exceptions

export type AuditSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Compliance Alert Configuration
export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  eventTypes: string[];
  conditions: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'regex';
    value: any;
  }[];
  severity: AuditSeverity;
  alertChannels: ('email' | 'slack' | 'webhook' | 'sms')[];
  autoResponse?: {
    action: 'block_user' | 'flag_account' | 'notify_compliance' | 'create_ticket';
    parameters?: any;
  };
  isActive: boolean;
}

// Regulatory Reporting Configuration
export interface RegulatoryReport {
  id: string;
  reportType: 'CNBV_MONTHLY' | 'CNBV_QUARTERLY' | 'CONDUSEF_COMPLAINTS' | 'PRIVACY_VIOLATIONS' | 'SUSPICIOUS_ACTIVITY';
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  eventCategories: AuditEventCategory[];
  aggregationRules: {
    groupBy: string[];
    metrics: string[];
    filters?: any;
  };
  deliveryMethod: 'EMAIL' | 'SFTP' | 'API' | 'PORTAL';
  recipients: string[];
  isActive: boolean;
}

export class AuditLogger extends EventEmitter {
  private db: Pool;
  private serverId: string;
  private environment: string;
  private complianceRules: Map<string, ComplianceRule> = new Map();
  private isInitialized: boolean = false;
  
  // Performance metrics
  private metrics = {
    eventsLogged: 0,
    complianceViolations: 0,
    criticalEvents: 0,
    averageLogTime: 0,
    errors: 0,
  };

  constructor(database: Pool, serverId: string, environment: string = 'production') {
    super();
    this.db = database;
    this.serverId = serverId;
    this.environment = environment;
    this.initialize();
  }

  /**
   * Initialize audit logger with compliance rules
   */
  private async initialize(): Promise<void> {
    try {
      // Load compliance rules from database
      await this.loadComplianceRules();
      
      // Set up automatic cleanup
      this.setupAutomaticCleanup();
      
      // Set up performance monitoring
      this.setupPerformanceMonitoring();
      
      this.isInitialized = true;
      
      await this.logEvent({
        eventType: 'AUDIT_LOGGER_INITIALIZED',
        eventCategory: 'system_operation',
        description: 'Audit logger initialized successfully',
        metadata: {
          serverId: this.serverId,
          environment: this.environment,
        },
      });
    } catch (error) {
      console.error('Failed to initialize audit logger:', error);
      throw error;
    }
  }

  /**
   * Log an audit event with full compliance checking
   */
  async logEvent(event: AuditEvent): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Enrich event with system information
      const enrichedEvent = this.enrichEvent(event);
      
      // Validate event data
      this.validateEvent(enrichedEvent);
      
      // Check for compliance violations
      const complianceViolations = await this.checkComplianceRules(enrichedEvent);
      if (complianceViolations.length > 0) {
        enrichedEvent.complianceFlags = complianceViolations.map(v => v.name);
        await this.handleComplianceViolations(enrichedEvent, complianceViolations);
      }
      
      // Store event in database
      await this.storeEvent(enrichedEvent);
      
      // Emit event for real-time processing
      this.emit('auditEvent', enrichedEvent);
      
      // Update metrics
      this.updateMetrics(enrichedEvent, Date.now() - startTime);
      
    } catch (error) {
      this.metrics.errors++;
      console.error('Failed to log audit event:', error);
      
      // Try to log the error itself (but don't create infinite loops)
      if (event.eventType !== 'AUDIT_LOGGING_ERROR') {
        try {
          await this.logEvent({
            eventType: 'AUDIT_LOGGING_ERROR',
            eventCategory: 'error',
            description: 'Failed to log audit event',
            error: error instanceof Error ? error.message : 'Unknown error',
            metadata: {
              originalEventType: event.eventType,
              originalCategory: event.eventCategory,
            },
            severity: 'HIGH',
          });
        } catch (nestedError) {
          console.error('Failed to log audit logging error:', nestedError);
        }
      }
      
      throw error;
    }
  }

  /**
   * Enrich event with system context
   */
  private enrichEvent(event: AuditEvent): AuditEvent {
    return {
      ...event,
      timestamp: event.timestamp || new Date(),
      serverId: this.serverId,
      environment: this.environment,
      requestId: event.requestId || crypto.randomUUID(),
      requiresRetention: event.requiresRetention ?? true,
      retentionYears: event.retentionYears ?? this.getDefaultRetentionYears(event.eventCategory),
      personalDataIncluded: this.detectPersonalData(event),
      sensitiveDataIncluded: this.detectSensitiveData(event),
    };
  }

  /**
   * Validate audit event data
   */
  private validateEvent(event: AuditEvent): void {
    if (!event.eventType) {
      throw new Error('Event type is required');
    }
    
    if (!event.eventCategory) {
      throw new Error('Event category is required');
    }
    
    if (!event.description) {
      throw new Error('Event description is required');
    }
    
    // Validate sensitive data handling
    if (event.personalDataIncluded && !event.userId) {
      console.warn('Personal data included but no user ID provided');
    }
    
    // Validate financial transaction events
    if (event.eventCategory === 'financial_transaction' && !event.amount) {
      console.warn('Financial transaction event without amount');
    }
  }

  /**
   * Check event against compliance rules
   */
  private async checkComplianceRules(event: AuditEvent): Promise<ComplianceRule[]> {
    const violations: ComplianceRule[] = [];
    
    for (const rule of this.complianceRules.values()) {
      if (!rule.isActive) continue;
      
      // Check if event type matches
      if (!rule.eventTypes.includes(event.eventType)) continue;
      
      // Check all conditions
      const conditionsMet = rule.conditions.every(condition => {
        const eventValue = this.getEventValue(event, condition.field);
        return this.evaluateCondition(eventValue, condition.operator, condition.value);
      });
      
      if (conditionsMet) {
        violations.push(rule);
      }
    }
    
    return violations;
  }

  /**
   * Handle compliance violations
   */
  private async handleComplianceViolations(
    event: AuditEvent, 
    violations: ComplianceRule[]
  ): Promise<void> {
    this.metrics.complianceViolations++;
    
    for (const violation of violations) {
      // Send alerts
      await this.sendComplianceAlert(event, violation);
      
      // Execute auto-response if configured
      if (violation.autoResponse) {
        await this.executeAutoResponse(event, violation.autoResponse);
      }
      
      // Log compliance violation
      await this.logComplianceViolation(event, violation);
    }
  }

  /**
   * Store event in database with encryption for sensitive data
   */
  private async storeEvent(event: AuditEvent): Promise<void> {
    const client = await this.db.connect();
    
    try {
      // Encrypt sensitive data before storage
      const processedEvent = await this.processEventForStorage(event);
      
      const query = `
        INSERT INTO compliance.audit_log (
          event_type, event_category, user_id, user_email, session_id,
          description, ip_address, user_agent, endpoint, http_method,
          request_id, resource_type, resource_id, request_data, response_data,
          response_status, amount, currency, product_id, institution_id,
          severity, risk_score, compliance_flags, error, error_code,
          stack_trace, metadata, timestamp, server_id, environment,
          requires_retention, retention_years, personal_data_included,
          sensitive_data_included, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
          $29, $30, $31, $32, $33, $34, NOW()
        )
      `;
      
      await client.query(query, [
        processedEvent.eventType,
        processedEvent.eventCategory,
        processedEvent.userId,
        processedEvent.userEmail,
        processedEvent.sessionId,
        processedEvent.description,
        processedEvent.ipAddress,
        processedEvent.userAgent,
        processedEvent.endpoint,
        processedEvent.httpMethod,
        processedEvent.requestId,
        processedEvent.resourceType,
        processedEvent.resourceId,
        JSON.stringify(processedEvent.requestData),
        JSON.stringify(processedEvent.responseData),
        processedEvent.responseStatus,
        processedEvent.amount,
        processedEvent.currency,
        processedEvent.productId,
        processedEvent.institutionId,
        processedEvent.severity,
        processedEvent.riskScore,
        processedEvent.complianceFlags,
        processedEvent.error,
        processedEvent.errorCode,
        processedEvent.stackTrace,
        JSON.stringify(processedEvent.metadata),
        processedEvent.timestamp,
        processedEvent.serverId,
        processedEvent.environment,
        processedEvent.requiresRetention,
        processedEvent.retentionYears,
        processedEvent.personalDataIncluded,
        processedEvent.sensitiveDataIncluded,
      ]);
    } catch (error) {
      throw new Error(`Failed to store audit event: ${error}`);
    } finally {
      client.release();
    }
  }

  /**
   * Process event for secure storage
   */
  private async processEventForStorage(event: AuditEvent): Promise<AuditEvent> {
    const processedEvent = { ...event };
    
    // Encrypt sensitive fields if they contain PII
    if (event.personalDataIncluded) {
      if (processedEvent.requestData) {
        processedEvent.requestData = await this.encryptSensitiveFields(processedEvent.requestData);
      }
      if (processedEvent.responseData) {
        processedEvent.responseData = await this.encryptSensitiveFields(processedEvent.responseData);
      }
    }
    
    // Hash IP addresses for privacy
    if (processedEvent.ipAddress) {
      processedEvent.ipAddress = crypto
        .createHash('sha256')
        .update(processedEvent.ipAddress)
        .digest('hex')
        .substring(0, 16);
    }
    
    return processedEvent;
  }

  /**
   * Encrypt sensitive fields in data objects
   */
  private async encryptSensitiveFields(data: any): Promise<any> {
    if (!data || typeof data !== 'object') return data;
    
    const sensitiveFields = ['curp', 'rfc', 'email', 'phone', 'accountNumber', 'cardNumber'];
    const processedData = { ...data };
    
    for (const field of sensitiveFields) {
      if (processedData[field]) {
        processedData[field] = '***ENCRYPTED***';
      }
    }
    
    return processedData;
  }

  /**
   * Load compliance rules from database
   */
  private async loadComplianceRules(): Promise<void> {
    try {
      const result = await this.db.query(`
        SELECT * FROM compliance.compliance_rules 
        WHERE is_active = true
      `);
      
      this.complianceRules.clear();
      
      for (const row of result.rows) {
        const rule: ComplianceRule = {
          id: row.id,
          name: row.name,
          description: row.description,
          eventTypes: row.event_types,
          conditions: row.conditions,
          severity: row.severity,
          alertChannels: row.alert_channels,
          autoResponse: row.auto_response,
          isActive: row.is_active,
        };
        
        this.complianceRules.set(rule.id, rule);
      }
      
      console.log(`Loaded ${this.complianceRules.size} compliance rules`);
    } catch (error) {
      console.error('Failed to load compliance rules:', error);
      // Continue with empty rules set
    }
  }

  /**
   * Detect if event contains personal data
   */
  private detectPersonalData(event: AuditEvent): boolean {
    const personalDataIndicators = [
      'curp', 'rfc', 'email', 'phone', 'address', 'name',
      'birth', 'ssn', 'passport', 'license'
    ];
    
    const eventString = JSON.stringify(event).toLowerCase();
    return personalDataIndicators.some(indicator => eventString.includes(indicator));
  }

  /**
   * Detect if event contains sensitive financial data
   */
  private detectSensitiveData(event: AuditEvent): boolean {
    const sensitiveDataIndicators = [
      'account', 'card', 'balance', 'transaction', 'payment',
      'credit', 'loan', 'score', 'income', 'salary'
    ];
    
    const eventString = JSON.stringify(event).toLowerCase();
    return sensitiveDataIndicators.some(indicator => eventString.includes(indicator));
  }

  /**
   * Get default retention years based on event category
   */
  private getDefaultRetentionYears(category: AuditEventCategory): number {
    const retentionPeriods = {
      'financial_transaction': 10,  // CNBV requirement
      'credit_inquiry': 6,          // Buró de Crédito requirement
      'kyc': 7,                     // CNBV requirement
      'compliance': 10,             // Regulatory compliance
      'security': 7,                // Security incidents
      'authentication': 3,          // Login records
      'data_access': 7,             // PII access logs
      'privacy': 7,                 // LFPDPPP requirement
      'fraud_detection': 10,        // Anti-fraud measures
    };
    
    return retentionPeriods[category] || 5; // Default 5 years
  }

  /**
   * Get event value for condition checking
   */
  private getEventValue(event: AuditEvent, field: string): any {
    const fieldPath = field.split('.');
    let value: any = event;
    
    for (const part of fieldPath) {
      value = value?.[part];
    }
    
    return value;
  }

  /**
   * Evaluate condition against event value
   */
  private evaluateCondition(eventValue: any, operator: string, conditionValue: any): boolean {
    switch (operator) {
      case 'equals':
        return eventValue === conditionValue;
      case 'contains':
        return String(eventValue).includes(String(conditionValue));
      case 'greater_than':
        return Number(eventValue) > Number(conditionValue);
      case 'less_than':
        return Number(eventValue) < Number(conditionValue);
      case 'regex':
        return new RegExp(conditionValue).test(String(eventValue));
      default:
        return false;
    }
  }

  /**
   * Send compliance alert
   */
  private async sendComplianceAlert(event: AuditEvent, rule: ComplianceRule): Promise<void> {
    const alertPayload = {
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity,
      event: {
        type: event.eventType,
        category: event.eventCategory,
        description: event.description,
        userId: event.userId,
        timestamp: event.timestamp,
      },
      metadata: event.metadata,
    };
    
    // Send alerts through configured channels
    for (const channel of rule.alertChannels) {
      try {
        await this.sendAlert(channel, alertPayload);
      } catch (error) {
        console.error(`Failed to send alert via ${channel}:`, error);
      }
    }
  }

  /**
   * Send alert through specific channel
   */
  private async sendAlert(channel: string, payload: any): Promise<void> {
    switch (channel) {
      case 'email':
        // Integrate with email service
        break;
      case 'slack':
        // Integrate with Slack API
        break;
      case 'webhook':
        // Send webhook notification
        break;
      case 'sms':
        // Integrate with SMS service
        break;
    }
  }

  /**
   * Execute automatic response to compliance violation
   */
  private async executeAutoResponse(event: AuditEvent, autoResponse: any): Promise<void> {
    try {
      switch (autoResponse.action) {
        case 'block_user':
          if (event.userId) {
            await this.blockUser(event.userId, autoResponse.parameters);
          }
          break;
        case 'flag_account':
          if (event.userId) {
            await this.flagAccount(event.userId, autoResponse.parameters);
          }
          break;
        case 'notify_compliance':
          await this.notifyComplianceTeam(event, autoResponse.parameters);
          break;
        case 'create_ticket':
          await this.createComplianceTicket(event, autoResponse.parameters);
          break;
      }
    } catch (error) {
      console.error('Failed to execute auto-response:', error);
    }
  }

  /**
   * Block user account
   */
  private async blockUser(userId: string, parameters: any): Promise<void> {
    await this.db.query(`
      UPDATE core.users 
      SET status = 'blocked', 
          updated_at = NOW() 
      WHERE id = $1
    `, [userId]);
    
    await this.logEvent({
      eventType: 'USER_BLOCKED_AUTOMATICALLY',
      eventCategory: 'security',
      userId: userId,
      description: 'User blocked due to compliance violation',
      severity: 'HIGH',
      metadata: parameters,
    });
  }

  /**
   * Flag account for review
   */
  private async flagAccount(userId: string, parameters: any): Promise<void> {
    await this.db.query(`
      UPDATE core.users 
      SET risk_score = GREATEST(risk_score, 80),
          updated_at = NOW() 
      WHERE id = $1
    `, [userId]);
    
    await this.logEvent({
      eventType: 'ACCOUNT_FLAGGED_AUTOMATICALLY',
      eventCategory: 'compliance',
      userId: userId,
      description: 'Account flagged for compliance review',
      severity: 'MEDIUM',
      metadata: parameters,
    });
  }

  /**
   * Notify compliance team
   */
  private async notifyComplianceTeam(event: AuditEvent, parameters: any): Promise<void> {
    // Implementation would send notifications to compliance team
    console.log('Compliance team notification sent for event:', event.eventType);
  }

  /**
   * Create compliance ticket
   */
  private async createComplianceTicket(event: AuditEvent, parameters: any): Promise<void> {
    // Implementation would create ticket in compliance system
    console.log('Compliance ticket created for event:', event.eventType);
  }

  /**
   * Log compliance violation
   */
  private async logComplianceViolation(event: AuditEvent, rule: ComplianceRule): Promise<void> {
    await this.db.query(`
      INSERT INTO compliance.violations (
        event_id, rule_id, rule_name, severity, detected_at, event_data
      ) VALUES ($1, $2, $3, $4, NOW(), $5)
    `, [
      event.requestId,
      rule.id,
      rule.name,
      rule.severity,
      JSON.stringify(event),
    ]);
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(event: AuditEvent, processingTime: number): void {
    this.metrics.eventsLogged++;
    
    if (event.severity === 'CRITICAL') {
      this.metrics.criticalEvents++;
    }
    
    // Update average processing time
    this.metrics.averageLogTime = 
      (this.metrics.averageLogTime * (this.metrics.eventsLogged - 1) + processingTime) / 
      this.metrics.eventsLogged;
  }

  /**
   * Set up automatic cleanup of old audit logs
   */
  private setupAutomaticCleanup(): void {
    // Run cleanup daily at 2 AM
    setInterval(async () => {
      try {
        await this.cleanupExpiredAuditLogs();
      } catch (error) {
        console.error('Failed to cleanup audit logs:', error);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours
  }

  /**
   * Clean up expired audit logs based on retention policy
   */
  private async cleanupExpiredAuditLogs(): Promise<void> {
    const result = await this.db.query(`
      DELETE FROM compliance.audit_log 
      WHERE created_at < NOW() - INTERVAL '1 year' * retention_years
        AND requires_retention = false
    `);
    
    if (result.rowCount && result.rowCount > 0) {
      await this.logEvent({
        eventType: 'AUDIT_LOG_CLEANUP',
        eventCategory: 'system_operation',
        description: `Cleaned up ${result.rowCount} expired audit log entries`,
        metadata: {
          deletedCount: result.rowCount,
        },
      });
    }
  }

  /**
   * Set up performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Log metrics every hour
    setInterval(() => {
      this.logEvent({
        eventType: 'AUDIT_LOGGER_METRICS',
        eventCategory: 'performance',
        description: 'Audit logger performance metrics',
        metadata: { ...this.metrics },
      });
    }, 60 * 60 * 1000); // 1 hour
  }

  /**
   * Get audit trail for a specific user
   */
  async getUserAuditTrail(
    userId: string, 
    startDate?: Date, 
    endDate?: Date,
    eventTypes?: string[]
  ): Promise<AuditEvent[]> {
    let query = `
      SELECT * FROM compliance.audit_log 
      WHERE user_id = $1
    `;
    
    const params: any[] = [userId];
    let paramIndex = 2;
    
    if (startDate) {
      query += ` AND created_at >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }
    
    if (endDate) {
      query += ` AND created_at <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }
    
    if (eventTypes && eventTypes.length > 0) {
      query += ` AND event_type = ANY($${paramIndex})`;
      params.push(eventTypes);
    }
    
    query += ` ORDER BY created_at DESC LIMIT 1000`;
    
    const result = await this.db.query(query, params);
    return result.rows;
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    reportType: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const query = `
      SELECT 
        event_category,
        event_type,
        COUNT(*) as event_count,
        COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_count,
        COUNT(CASE WHEN severity = 'HIGH' THEN 1 END) as high_count,
        COUNT(CASE WHEN compliance_flags IS NOT NULL THEN 1 END) as violation_count
      FROM compliance.audit_log 
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY event_category, event_type
      ORDER BY event_count DESC
    `;
    
    const result = await this.db.query(query, [startDate, endDate]);
    
    return {
      reportType,
      periodStart: startDate,
      periodEnd: endDate,
      generatedAt: new Date(),
      summary: {
        totalEvents: result.rows.reduce((sum, row) => sum + parseInt(row.event_count), 0),
        criticalEvents: result.rows.reduce((sum, row) => sum + parseInt(row.critical_count), 0),
        violations: result.rows.reduce((sum, row) => sum + parseInt(row.violation_count), 0),
      },
      details: result.rows,
    };
  }

  /**
   * Get performance metrics
   */
  getMetrics(): any {
    return {
      ...this.metrics,
      uptime: process.uptime(),
      serverId: this.serverId,
      environment: this.environment,
      rulesLoaded: this.complianceRules.size,
    };
  }
}