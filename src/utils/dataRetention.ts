// Data retention and cleanup utilities

export class DataRetentionManager {
  private static readonly RETENTION_PERIODS = {
    formData: 24 * 60 * 60 * 1000, // 24 hours
    userSessions: 7 * 24 * 60 * 60 * 1000, // 7 days
    securityLogs: 30 * 24 * 60 * 60 * 1000, // 30 days
    analytics: 90 * 24 * 60 * 60 * 1000, // 90 days
  };

  static async cleanupExpiredData(): Promise<void> {
    const now = Date.now();
    
    try {
      // Clean up form data
      this.cleanupStorageByAge('hp_form_', this.RETENTION_PERIODS.formData, now);
      
      // Clean up security logs
      this.cleanupSecurityLogs(now);
      
      // Clean up analytics data
      this.cleanupAnalyticsData(now);
      
      console.log('Data retention cleanup completed');
    } catch (error) {
      console.warn('Data retention cleanup failed:', error);
    }
  }

  private static cleanupStorageByAge(prefix: string, maxAge: number, now: number): void {
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const data = JSON.parse(item);
            if (data.timestamp && (now - data.timestamp) > maxAge) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          // Remove corrupted items
          localStorage.removeItem(key);
        }
      }
    });
  }

  private static cleanupSecurityLogs(now: number): void {
    try {
      const criticalEvents = JSON.parse(
        localStorage.getItem('hp_critical_events') || '[]'
      );
      
      const validEvents = criticalEvents.filter((event: any) => 
        event.timestamp && (now - event.timestamp) <= this.RETENTION_PERIODS.securityLogs
      );
      
      localStorage.setItem('hp_critical_events', JSON.stringify(validEvents));
    } catch {
      localStorage.removeItem('hp_critical_events');
    }
  }

  private static cleanupAnalyticsData(now: number): void {
    // Clean up any analytics data stored locally
    const analyticsKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('hp_analytics_') || key.startsWith('hp_stats_')
    );
    
    analyticsKeys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const data = JSON.parse(item);
          if (data.timestamp && (now - data.timestamp) > this.RETENTION_PERIODS.analytics) {
            localStorage.removeItem(key);
          }
        }
      } catch {
        localStorage.removeItem(key);
      }
    });
  }

  static initAutoCleanup(): void {
    // Run cleanup on initialization
    this.cleanupExpiredData();
    
    // Schedule regular cleanup every 6 hours
    setInterval(() => {
      this.cleanupExpiredData();
    }, 6 * 60 * 60 * 1000);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanupExpiredData();
    });
  }

  static getDataRetentionInfo(): Record<string, string> {
    return {
      'Form Data': '24 hours',
      'User Sessions': '7 days',
      'Security Logs': '30 days',
      'Analytics Data': '90 days'
    };
  }

  static manualCleanup(): void {
    // Allow users to manually trigger cleanup
    this.cleanupExpiredData();
    
    // Also clear non-essential cached data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('hp_cache_') || key.startsWith('hp_temp_')) {
        localStorage.removeItem(key);
      }
    });
  }
}