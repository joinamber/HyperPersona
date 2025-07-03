// Security event logging and monitoring

export enum SecurityEventType {
  AUTH_SUCCESS = 'auth_success',
  AUTH_FAILURE = 'auth_failure',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  INVALID_INPUT = 'invalid_input',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  DATA_ACCESS = 'data_access',
  FORM_SUBMISSION = 'form_submission'
}

export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
  details?: Record<string, any>;
  severity: 'low' | 'medium' | 'high';
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 1000;

  log(
    type: SecurityEventType,
    details?: Record<string, any>,
    severity: 'low' | 'medium' | 'high' = 'low'
  ): void {
    const event: SecurityEvent = {
      type,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      details: this.sanitizeDetails(details),
      severity
    };

    // Add user ID if available
    const user = this.getCurrentUser();
    if (user) {
      event.userId = user;
    }

    this.events.push(event);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Security Event] ${type}:`, event);
    }

    // Handle high severity events
    if (severity === 'high') {
      this.handleHighSeverityEvent(event);
    }
  }

  private sanitizeDetails(details?: Record<string, any>): Record<string, any> {
    if (!details) return {};

    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(details)) {
      // Don't log sensitive information
      if (this.isSensitiveField(key)) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string') {
        sanitized[key] = value.substring(0, 200); // Limit string length
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  private isSensitiveField(fieldName: string): boolean {
    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'auth',
      'email', 'phone', 'ssn', 'credit', 'payment'
    ];
    return sensitiveFields.some(field => 
      fieldName.toLowerCase().includes(field)
    );
  }

  private getCurrentUser(): string | undefined {
    try {
      // Try to get user from auth context or localStorage
      const authData = localStorage.getItem('supabase.auth.token');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed?.user?.id?.substring(0, 8); // Only log partial ID
      }
    } catch {
      // Ignore errors
    }
    return undefined;
  }

  private handleHighSeverityEvent(event: SecurityEvent): void {
    // Could integrate with external monitoring service
    console.warn('[HIGH SEVERITY SECURITY EVENT]', event);
    
    // Store in secure storage for later analysis
    try {
      const criticalEvents = JSON.parse(
        localStorage.getItem('hp_critical_events') || '[]'
      );
      criticalEvents.push(event);
      
      // Keep only last 50 critical events
      if (criticalEvents.length > 50) {
        criticalEvents.splice(0, criticalEvents.length - 50);
      }
      
      localStorage.setItem('hp_critical_events', JSON.stringify(criticalEvents));
    } catch {
      // Ignore storage errors
    }
  }

  getRecentEvents(count: number = 100): SecurityEvent[] {
    return this.events.slice(-count);
  }

  getEventsByType(type: SecurityEventType): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  clearEvents(): void {
    this.events = [];
  }
}

// Global security logger instance
export const securityLogger = new SecurityLogger();

// Helper functions for common events
export const logAuthSuccess = (userId: string) => {
  securityLogger.log(SecurityEventType.AUTH_SUCCESS, { userId }, 'low');
};

export const logAuthFailure = (reason: string) => {
  securityLogger.log(SecurityEventType.AUTH_FAILURE, { reason }, 'medium');
};

export const logRateLimitExceeded = (endpoint: string) => {
  securityLogger.log(SecurityEventType.RATE_LIMIT_EXCEEDED, { endpoint }, 'high');
};

export const logSuspiciousActivity = (activity: string, details?: Record<string, any>) => {
  securityLogger.log(SecurityEventType.SUSPICIOUS_ACTIVITY, { activity, ...details }, 'high');
};
