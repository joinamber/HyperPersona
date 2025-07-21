// Secure local storage utilities with encryption and automatic cleanup

interface StorageItem {
  value: string;
  timestamp: number;
  expires?: number;
}

class SecureStorage {
  private static readonly PREFIX = 'hp_secure_';
  private static readonly DEFAULT_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  // Simple encryption/decryption using base64 encoding with salt
  private static encrypt(data: string): string {
    const salt = Math.random().toString(36).substring(2);
    // Convert Unicode string to UTF-8 bytes, then to base64
    const utf8Data = new TextEncoder().encode(salt + data);
    const binaryString = Array.from(utf8Data, byte => String.fromCharCode(byte)).join('');
    const encoded = btoa(binaryString);
    return encoded;
  }

  private static decrypt(data: string): string {
    try {
      // Decode base64 to binary string, then to UTF-8
      const binaryString = atob(data);
      const utf8Data = new Uint8Array(binaryString.split('').map(char => char.charCodeAt(0)));
      const decoded = new TextDecoder().decode(utf8Data);
      return decoded.substring(10); // Remove salt
    } catch {
      return '';
    }
  }

  static setItem(key: string, value: string, expiryMs?: number): void {
    try {
      const item: StorageItem = {
        value: this.encrypt(value),
        timestamp: Date.now(),
        expires: expiryMs ? Date.now() + expiryMs : Date.now() + this.DEFAULT_EXPIRY
      };
      
      localStorage.setItem(this.PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to store secure item:', error);
    }
  }

  static getItem(key: string): string | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      if (!item) return null;

      const parsed: StorageItem = JSON.parse(item);
      
      // Check if expired
      if (parsed.expires && Date.now() > parsed.expires) {
        this.removeItem(key);
        return null;
      }

      return this.decrypt(parsed.value);
    } catch (error) {
      console.warn('Failed to retrieve secure item:', error);
      this.removeItem(key);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (error) {
      console.warn('Failed to remove secure item:', error);
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear secure storage:', error);
    }
  }

  // Clean up expired items
  static cleanup(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          const item = localStorage.getItem(key);
          if (item) {
            try {
              const parsed: StorageItem = JSON.parse(item);
              if (parsed.expires && Date.now() > parsed.expires) {
                localStorage.removeItem(key);
              }
            } catch {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.warn('Failed to cleanup secure storage:', error);
    }
  }

  // Auto cleanup on page unload
  static initAutoCleanup(): void {
    // Cleanup expired items on load
    this.cleanup();

    // Clear sensitive data on page unload for security
    window.addEventListener('beforeunload', () => {
      // Only clear auth-related temporary data
      this.removeItem('pendingFormData');
      this.removeItem('pendingProductImages');
    });

    // Periodic cleanup every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }
}

export default SecureStorage;