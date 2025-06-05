
// Input validation utilities

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateInput(value: string, rules: ValidationRule): ValidationResult {
  // Check if required
  if (rules.required && (!value || value.trim().length === 0)) {
    return { isValid: false, error: 'This field is required' };
  }

  // Skip other validations if not required and empty
  if (!rules.required && (!value || value.trim().length === 0)) {
    return { isValid: true };
  }

  // Check minimum length
  if (rules.minLength && value.length < rules.minLength) {
    return { isValid: false, error: `Minimum ${rules.minLength} characters required` };
  }

  // Check maximum length
  if (rules.maxLength && value.length > rules.maxLength) {
    return { isValid: false, error: `Maximum ${rules.maxLength} characters allowed` };
  }

  // Check pattern
  if (rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, error: 'Invalid format' };
  }

  return { isValid: true };
}

// Sanitize input to prevent XSS
export function sanitizeInput(value: string): string {
  if (!value) return '';
  
  return value
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Product form validation rules
export const productFormRules = {
  productName: { required: true, minLength: 2, maxLength: 100 },
  productDescription: { required: true, minLength: 10, maxLength: 2000 },
  targetAudience: { maxLength: 500 },
  keyFeatures: { maxLength: 1000 },
  category: { maxLength: 50 },
  priceRange: { maxLength: 50 },
  businessGoals: { maxLength: 1000 }
};
